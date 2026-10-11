import {
  ApiError,
  httpClient,
} from '../../src/services/http/httpClient';
import { tokenStorage } from '../../src/services/security/tokenStorage';

jest.mock(
  '../../src/services/security/tokenStorage',
  () => ({
    tokenStorage: {
      getAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
      updateAccessToken:
        jest.fn(),
      clearTokens: jest.fn(),
    },
  }),
);

const mockedTokenStorage =
  tokenStorage as jest.Mocked<
    typeof tokenStorage
  >;

const fetchMock = jest.fn();

function createResponse(
  status: number,
  data: unknown,
): Response {
  return {
    ok:
      status >= 200 &&
      status < 300,
    status,
    text: jest
      .fn()
      .mockResolvedValue(
        data === null
          ? ''
          : JSON.stringify(data),
      ),
  } as unknown as Response;
}

describe('HttpClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    globalThis.fetch =
      fetchMock as typeof fetch;

    mockedTokenStorage
      .getAccessToken
      .mockResolvedValue(null);

    mockedTokenStorage
      .getRefreshToken
      .mockResolvedValue(null);

    mockedTokenStorage
      .updateAccessToken
      .mockResolvedValue();

    mockedTokenStorage
      .clearTokens
      .mockResolvedValue();
  });

  test(
    'agrega el access token como Bearer en una petición protegida',
    async () => {
      mockedTokenStorage
        .getAccessToken
        .mockResolvedValue(
          'access-token-test',
        );

      fetchMock.mockResolvedValueOnce(
        createResponse(200, {
          ok: true,
        }),
      );

      await httpClient.request(
        '/auth/check-session',
        {
          method: 'GET',
        },
      );

      expect(
        fetchMock,
      ).toHaveBeenCalledTimes(1);

      const requestOptions =
        fetchMock.mock.calls[0][1] as
        RequestInit;

      const headers =
        requestOptions
          .headers as Headers;

      expect(
        headers.get(
          'Authorization',
        ),
      ).toBe(
        'Bearer access-token-test',
      );
    },
  );

  test(
    'renueva el access token después de un 401 y repite la petición',
    async () => {
      mockedTokenStorage
        .getAccessToken
        .mockResolvedValue(
          'access-token-expirado',
        );

      mockedTokenStorage
        .getRefreshToken
        .mockResolvedValue(
          'refresh-token-valido',
        );

      fetchMock
        .mockResolvedValueOnce(
          createResponse(401, {
            message:
              'No autorizado',
          }),
        )
        .mockResolvedValueOnce(
          createResponse(200, {
            message:
              'Token renovado correctamente',
            accessToken:
              'access-token-nuevo',
            tokenType: 'Bearer',
            expiresIn: 900,
          }),
        )
        .mockResolvedValueOnce(
          createResponse(200, {
            ok: true,
          }),
        );

      const result =
        await httpClient.request<{
          ok: boolean;
        }>(
          '/auth/check-session',
          {
            method: 'GET',
          },
        );

      expect(result).toEqual({
        ok: true,
      });

      expect(
        fetchMock,
      ).toHaveBeenCalledTimes(3);

      expect(
        mockedTokenStorage
          .getRefreshToken,
      ).toHaveBeenCalledTimes(1);

      expect(
        mockedTokenStorage
          .updateAccessToken,
      ).toHaveBeenCalledWith(
        'access-token-nuevo',
      );

      const refreshUrl =
        fetchMock.mock
          .calls[1][0];

      expect(refreshUrl).toContain(
        '/auth/mobile/refresh',
      );

      const refreshOptions =
        fetchMock.mock.calls[1][1] as
        RequestInit;

      expect(
        JSON.parse(
          refreshOptions.body as string,
        ),
      ).toEqual({
        refreshToken:
          'refresh-token-valido',
      });

      const retryOptions =
        fetchMock.mock.calls[2][1] as
        RequestInit;

      const retryHeaders =
        retryOptions
          .headers as Headers;

      expect(
        retryHeaders.get(
          'Authorization',
        ),
      ).toBe(
        'Bearer access-token-nuevo',
      );
    },
  );

  test(
    'elimina los tokens cuando el refresh token ya no es válido',
    async () => {
      mockedTokenStorage
        .getAccessToken
        .mockResolvedValue(
          'access-token-expirado',
        );

      mockedTokenStorage
        .getRefreshToken
        .mockResolvedValue(
          'refresh-token-invalido',
        );

      fetchMock
        .mockResolvedValueOnce(
          createResponse(401, {
            message:
              'No autorizado',
          }),
        )
        .mockResolvedValueOnce(
          createResponse(401, {
            message:
              'La sesión ya no es válida',
          }),
        );

      await expect(
        httpClient.request(
          '/auth/check-session',
          {
            method: 'GET',
          },
        ),
      ).rejects.toEqual(
        expect.objectContaining({
          status: 401,
        }),
      );

      expect(
        mockedTokenStorage
          .clearTokens,
      ).toHaveBeenCalledTimes(1);

      expect(
        fetchMock,
      ).toHaveBeenCalledTimes(2);
    },
  );

  test(
    'propaga ApiError cuando una petición falla y no puede renovarse',
    async () => {
      mockedTokenStorage
        .getAccessToken
        .mockResolvedValue(null);

      mockedTokenStorage
        .getRefreshToken
        .mockResolvedValue(null);

      fetchMock.mockResolvedValueOnce(
        createResponse(401, {
          message:
            'No hay sesión activa',
        }),
      );

      try {
        await httpClient.request(
          '/auth/check-session',
          {
            method: 'GET',
          },
        );

        throw new Error(
          'La petición debía fallar',
        );
      } catch (error) {
        expect(
          error,
        ).toBeInstanceOf(
          ApiError,
        );

        expect(
          (
            error as ApiError
          ).status,
        ).toBe(401);
      }
    },
  );
});