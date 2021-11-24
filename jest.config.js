module.exports = {
  globals: {
    window: true,
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
    'vue-jest': {
      experimentalCSSCompile: false,
    },
  },
  rootDir: '.',
  setupFiles: ['<rootDir>/src/test/jestsetup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest-dom-importer.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '@nuxtjs/composition-api': '@nuxtjs/composition-api/lib/entrypoint.js',
    '@vue/apollo-composable': '@vue/apollo-composable/dist/index.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue'],
  transform: {
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '.(ts|tsx)$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@vue/apollo-composable).+\\.js$'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['/cypress/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*', '!src/**/*.stories.ts', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/api/',
    '/assets/',
    '/enums/',
    '/fixtures/',
    '/interfaces/',
    '/layouts/',
    '/plugins/',
    '/services/',
    '/static/',
    '/test/',
    'src/store/index.ts',
    'src/interfaces/graphql',
    'src/interfaces/swagger',
    'src/components/global.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text', 'lcov', 'json'],
  preset: 'ts-jest',
  testMatch: null,
};
