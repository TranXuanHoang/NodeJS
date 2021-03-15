/**
 * This next.config.js is automatically read by NextJS.
 * The following config is to tell webpack to poll all source files
 * from the project directory every 300ms and if there are any changes
 * it will reflect them to the browser.
 * So this file is to make sure that NextJS code is automatically
 * reflected on the web browsers.
 */
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300
    return config
  }
}
