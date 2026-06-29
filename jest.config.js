module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['show-ip/js/iputils.js'],
  coverageReporters: ['text', 'lcov'],
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
