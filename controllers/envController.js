
const appConfig = require('../lib/app-config.js');

exports.env_about = (req, res) => {
  res.send( appConfig.current.getEnvSettings(req.params.env) );
};

/**
 * gets a list of the environemnts from the app configuartion
 */
exports.env_list = (req, res) => {
  res.send( appConfig.current.getEnvNames() );
};