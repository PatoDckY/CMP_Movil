const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const configFile = path.resolve(__dirname, '../../babel.config.js');
const filename = path.resolve(__dirname, '../../src/config/apiConfig.ts');
const original = process.env.CMP_API_BASE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.CMP_API_BASE_URL;
  } else {
    process.env.CMP_API_BASE_URL = original;
  }
});

test.each([
  undefined,
  'https://isolated.example.test/api',
  'invalid-legacy-override',
])(
  'la configuración se ejecuta sin globals de compilación ni Node; ignora override anterior %s',
  value => {
    if (value === undefined) {
      delete process.env.CMP_API_BASE_URL;
    } else {
      process.env.CMP_API_BASE_URL = value;
    }
    jest.isolateModules(() => {
      const config = require(configFile);
      const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
        ...config,
        filename,
        configFile: false,
        babelrc: false,
      });
      const output = {};
      expect(() =>
        vm.runInNewContext(result.code, { exports: output }),
      ).not.toThrow();
      expect(output.API_BASE_URL).toBe('https://cmp-site.vercel.app/api');
      expect(result.code).not.toContain('__CMP_API_BASE_URL__');
      expect(result.code).not.toContain('process.env');
      expect(result.code).not.toContain('example.test');
      expect(config.plugins).toEqual(['react-native-worklets/plugin']);
    });
  },
);
