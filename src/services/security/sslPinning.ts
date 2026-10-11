import {
  initializeSslPinning,
} from 'react-native-ssl-public-key-pinning';

const CMP_API_HOST =
  'cmp-site.vercel.app';

const CMP_PUBLIC_KEY_HASHES = [
  'xRUwi70J41GFIbtkDY38VXIAoWtbsGGG+LWfenCZh7k=',
  'yDu9og255NN5GEf+Bwa9rTrqFQ0EydZ0r1FCh9TdAW4=',
];

export async function initializeCmpSslPinning():
  Promise<void> {
  await initializeSslPinning({
    [CMP_API_HOST]: {
      includeSubdomains: false,
      publicKeyHashes:
        CMP_PUBLIC_KEY_HASHES,
    },
  });
}