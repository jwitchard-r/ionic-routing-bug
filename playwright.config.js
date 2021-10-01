const version = require('./package.json').dependencies['@ionic/react'].replace('^', '')

module.exports = {
  outputDir: require('path').join(__dirname, 'test-results', version),
  webServer: {
    command: 'npm run start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {},
}
