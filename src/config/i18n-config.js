const { path } = require("../config/dependencies");

module.exports = {
  locales: ["en", "es", "eu"],
  defaultLocale: "en",
  directory: path.join(__dirname, "../locales"),
  updateFiles: false,
  objectNotation: true,
  api: {
    __: "__",
    __n: "__n",
  },
};
