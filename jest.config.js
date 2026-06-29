module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['show-ip/js/iputils.js'],
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.js'],
};
