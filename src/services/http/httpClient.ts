import {API_BASE_URL} from '../../config/apiConfig';

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

export class HttpClient {
  private static instance:
    HttpClient | null = null;

  private readonly baseUrl: string;

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

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(
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

    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      {
        ...options,
        credentials: 'include',
        headers,
      },
    );

    const text =
      await response.text();

    let data: unknown = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

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