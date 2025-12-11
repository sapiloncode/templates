const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',

    chromeWebSecurity: false, // Disable Chrome Web Security

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
