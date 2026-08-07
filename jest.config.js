module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['show-ip/js/iputils.js', 'scripts/coverage-report.js'],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
};
