const Augmented = require("augmentedjs");
const CONSTANTS = require("./constants.js");

const logger = Augmented.Logger.LoggerFactory.getLogger(
    Augmented.Logger.Type.console, Augmented.Logger.Level.debug);
module.exports = {
    _prefix: CONSTANTS.APP_NAME,
    setPrefix: function(prefix) {
      this._prefix = prefix;
    },
    info: function(message) {
        logger.info(this._prefix + ": " + message);
    },
    debug: function(message) {
        logger.debug(this._prefix + ": " + message);
    },
    warn: function(message) {
        logger.warn(this._prefix + ": " + message);
    },
    error: function(message) {
        logger.error(this._prefix + ": " + message);
    }
};
