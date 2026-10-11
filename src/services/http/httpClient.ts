import { API_BASE_URL } from '../../config/apiConfig';
import { tokenStorage } from '../security/tokenStorage';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown,
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RefreshResponse {
  message?: string;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

function getErrorMessage(
  data: unknown,
): string {
  if (
    typeof data !== 'object' ||
    data === null
  ) {
    return 'Ocurrió un error al comunicarse con el servidor';
  }

  const response = data as {
    error?: string;
    message?: string;
  };

  return (
    response.error ??
    response.message ??
    'Ocurrió un error al comunicarse con el servidor'
  );
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const text =
    await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export class HttpClient {
  private static instance:
    HttpClient | null = null;

  private readonly baseUrl: string;

  private refreshPromise:
    Promise<string | null> | null =
    null;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance =
        new HttpClient();
    }

    return HttpClient.instance;
  }

  private async sendRequest(
    endpoint: string,
    options: RequestInit,
    accessToken: string | null,
  ): Promise<Response> {
    const headers =
      new Headers(
        options.headers,
      );

    headers.set(
      'Accept',
      'application/json',
    );

    if (options.body) {
      headers.set(
        'Content-Type',
        'application/json',
      );
    }

    if (
      accessToken &&
      !headers.has(
        'Authorization',
      )
    ) {
      headers.set(
        'Authorization',
        `Bearer ${accessToken}`,
      );
    }

    return fetch(
      `${this.baseUrl}${endpoint}`,
      {
        ...options,
        headers,
      },
    );
  }

  private shouldAttemptRefresh(
    endpoint: string,
  ): boolean {
    return (
      endpoint !==
      '/auth/mobile/login' &&
      endpoint !==
      '/auth/mobile/refresh'
    );
  }

  private async refreshAccessToken():
    Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise =
      this.performRefresh();

    try {
      return await this
        .refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh():
    Promise<string | null> {
    const refreshToken =
      await tokenStorage
        .getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response =
        await fetch(
          `${this.baseUrl}/auth/mobile/refresh`,
          {
            method: 'POST',
            headers: {
              Accept:
                'application/json',
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              refreshToken,
            }),
          },
        );

      const data =
        await parseResponse(
          response,
        );

      if (!response.ok) {
        if (
          response.status ===
          401 ||
          response.status === 403
        ) {
          await tokenStorage
            .clearTokens();
        }

        return null;
      }

      if (
        typeof data !==
        'object' ||
        data === null
      ) {
        return null;
      }

      const refreshResponse =
        data as Partial<RefreshResponse>;

      if (
        typeof refreshResponse
          .accessToken !==
        'string' ||
        !refreshResponse
          .accessToken
      ) {
        return null;
      }

      await tokenStorage
        .updateAccessToken(
          refreshResponse
            .accessToken,
        );

      return refreshResponse
        .accessToken;
    } catch {
      /*
       * Un error de red no elimina
       * el refresh token.
       *
       * Puede tratarse simplemente
       * de falta temporal de conexión.
       */
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const accessToken =
      await tokenStorage
        .getAccessToken();

    let response =
      await this.sendRequest(
        endpoint,
        options,
        accessToken,
      );

    /*
     * Si el access token expiró,
     * intenta renovarlo una sola vez
     * y repite la petición original.
     */
    if (
      response.status === 401 &&
      this.shouldAttemptRefresh(
        endpoint,
      )
    ) {
      const newAccessToken =
        await this
          .refreshAccessToken();

      if (newAccessToken) {
        response =
          await this.sendRequest(
            endpoint,
            options,
            newAccessToken,
          );
      }
    }

    const data =
      await parseResponse(
        response,
      );

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(data),
        response.status,
        data,
      );
    }

    return data as T;
  }
}

export const httpClient =
  HttpClient.getInstance();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  return httpClient.request<T>(
    endpoint,
    options,
  );
}