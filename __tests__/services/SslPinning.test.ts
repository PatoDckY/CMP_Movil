import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import { initializeCmpSslPinning } from '../../src/services/security/sslPinning';

jest.mock('react-native-ssl-public-key-pinning', () => ({
  initializeSslPinning: jest.fn(),
}));
describe('A63 - configuración nativa de pinning', () => {
  beforeEach(() => jest.resetAllMocks());
  test('configura el host concreto y dos claves públicas sin admitir subdominios', async () => {
    await initializeCmpSslPinning();
    const config = (initializeSslPinning as jest.Mock).mock.calls[0][0];
    expect(Object.keys(config)).toEqual(['cmp-site.vercel.app']);
    expect(config['cmp-site.vercel.app'].includeSubdomains).toBe(false);
    expect(config['cmp-site.vercel.app'].publicKeyHashes).toHaveLength(2);
  });
  test('el rechazo nativo se propaga y no habilita una conexión sin protección', async () => {
    (initializeSslPinning as jest.Mock).mockRejectedValue(
      new Error('Fallo nativo simulado'),
    );
    await expect(initializeCmpSslPinning()).rejects.toThrow('Fallo nativo');
  });
});
