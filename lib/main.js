//#region import
const {
  setConfig,
  resetConfig,
  getConfig
} = require('./config');
const Base = require('./class/Base');
const Externalcontact = require('./class/Externalcontact');
const Authorize = require('./class/Authorize');
const Callback = require('./class/Callback');
const Concats = require('./class/Concats');
//#endregion

module.exports = {
  Base,
  setConfig,
  resetConfig,
  getConfig,
  // 
  Externalcontact,
  Authorize,
  Callback,
  Concats,
};