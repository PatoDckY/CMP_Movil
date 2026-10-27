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

export const NETWORK_ERROR_MESSAGE =
  'No fue posible conectarse con el servidor. Revisa tu conexión e inténtalo de nuevo.';

interface RefreshResponse {
  message?: string;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

interface RequestPolicy {
  accessToken?: string;
  timeoutMs?: number;
  requireAuthentication?: boolean;
  expectedStatus?: number;
  // Un 401 con token ya renovado es un rechazo de la operación (p. ej. contraseña
  // actual incorrecta), no una sesión inválida: no se borran las credenciales.
  preserveSessionOnUnauthorized?: boolean;
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

async function requestWithTimeout<T>(
  timeoutMs: number,
  operation: (signal: AbortSignal) => Promise<T>,
  message: string,
): Promise<T> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(controller.signal),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(message));
          controller.abort();
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

export class HttpClient {
  private static instance:
    HttpClient | null = null;

  private readonly baseUrl: string;

  private refreshPromise:
    Promise<string | null> | null =
    null;
  private refreshVersion: number | null = null;

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

    try {
      return await fetch(
        `${this.baseUrl}${endpoint}`,
        {
          ...options,
          headers,
        },
      );
    } catch (error) {
      // React Native reporta la falta de red como TypeError en inglés; todas las
      // pantallas muestran err.message, así que se traduce en un único punto.
      if (error instanceof TypeError) {
        throw new Error(NETWORK_ERROR_MESSAGE);
      }
      throw error;
    }
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
    const version = tokenStorage.getSessionVersion();
    if (this.refreshPromise && this.refreshVersion === version) {
      return this.refreshPromise;
    }

    const operation = this.performRefresh();
    this.refreshPromise = operation;
    this.refreshVersion = version;

    try {
      return await operation;
    } finally {
      if (this.refreshPromise === operation) {
        this.refreshPromise = null;
        this.refreshVersion = null;
      }
    }
  }

  private async performRefresh():
    Promise<string | null> {
    const version = tokenStorage.getSessionVersion();
    const refreshToken =
      await tokenStorage
        .getRefreshToken();

    if (!refreshToken || version !== tokenStorage.getSessionVersion()) {
      return null;
    }

    try {
      const {response, data} = await requestWithTimeout(15_000, async signal => {
        const refreshedResponse =
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
            signal,
          },
        );
        return {response: refreshedResponse, data: await parseResponse(refreshedResponse)};
      }, 'Se agotó el tiempo de renovación de sesión.');

      if (version !== tokenStorage.getSessionVersion()) {
        return null;
      }

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

      const updated = await tokenStorage
        .updateAccessToken(
          refreshResponse
            .accessToken,
          version,
        );

      return updated && version === tokenStorage.getSessionVersion()
        ? refreshResponse.accessToken
        : null;
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
    policy?: RequestPolicy,
  ): Promise<T> {
    if (policy?.accessToken) {
      const revocationToken = policy.accessToken;
      // La revocación usa el token capturado; no lee Keychain ni renueva sesión.
      return requestWithTimeout(policy.timeoutMs ?? 10_000, async signal => {
        const response = await this.sendRequest(endpoint, {...options, signal}, revocationToken);
        const data = await parseResponse(response);
        if (!response.ok) {
          throw new ApiError(getErrorMessage(data), response.status, data);
        }
        return data as T;
      }, 'Se agotó el tiempo de revocación remota.');
    }
    if (policy?.timeoutMs) {
      return requestWithTimeout(policy.timeoutMs,
        signal => this.request<T>(endpoint, {...options, signal}, {...policy, timeoutMs: undefined}),
        'No fue posible confirmar la respuesta a tiempo.');
    }
    const version = tokenStorage.getSessionVersion();
    const assertCurrentSession = () => {
      if (options.signal?.aborted) {
        throw new Error('La operación fue cancelada o superó el tiempo límite.');
      }
      if (version !== tokenStorage.getSessionVersion()) {
        throw new ApiError('La sesión local se cerró.', 401, null);
      }
    };
    const accessToken =
      await tokenStorage
        .getAccessToken();

    assertCurrentSession();

    if (policy?.requireAuthentication && !accessToken) {
      await tokenStorage.clearTokens();
      throw new ApiError('Se requiere una sesión móvil activa.', 401, null);
    }

    let refreshed = false;
    let response =
      await this.sendRequest(
        endpoint,
        options,
        accessToken,
      );

    assertCurrentSession();

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

      assertCurrentSession();

      if (newAccessToken) {
        refreshed = true;
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

    assertCurrentSession();

    if (!response.ok) {
      if (response.status === 401 && accessToken && version === tokenStorage.getSessionVersion()) {
        const refreshToken = await tokenStorage.getRefreshToken();
        assertCurrentSession();
        // Si falló la red durante el refresh se conservan credenciales y contexto.
        if ((refreshed && !policy?.preserveSessionOnUnauthorized) || !refreshToken) {
          await tokenStorage.clearTokens();
        }
      }
      throw new ApiError(
        response.status >= 500 ? 'El servidor no pudo completar la operación. Intenta nuevamente más tarde.' : getErrorMessage(data),
        response.status,
        data,
      );
    }

    if (policy?.expectedStatus !== undefined && response.status !== policy.expectedStatus) {
      throw new ApiError('No fue posible verificar la aceptación de la solicitud.', response.status, null);
    }

    return data as T;
  }
}

export const httpClient =
  HttpClient.getInstance();

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  policy?: RequestPolicy,
): Promise<T> {
  return httpClient.request<T>(
    endpoint,
    options,
    policy,
  );
}
