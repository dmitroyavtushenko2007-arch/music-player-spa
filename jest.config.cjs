module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  moduleNameMapper: {
    // css в тестах не потрібен
    "\\.(css)$": "identity-obj-proxy",
  },
};
