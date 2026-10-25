module.exports = {
  preset: '@react-native/jest-preset',
  // react-native-markdown-display se publica como ESM sin compilar.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-markdown-display)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'src/{mappers,models,repositories,services,session,viewmodels}/**/*.{ts,tsx}',
    '!src/**/contracts/**',
    '!src/services/dto/**',
  ],
  coverageReporters: ['text-summary', 'json-summary', 'lcov'],
  coverageThreshold: {global: {statements: 80, branches: 80, functions: 80, lines: 80}},
};
