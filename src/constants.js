const { version } = require('../package.json');

// URL stuff
const SCHEME = 'https://';
const BASE_URL = 'api.fintoc.com/v1/';

// Client stuff
const USER_AGENT = `fintoc-node/${version}`;

// Misc stuff
const DOCUMENTATION_URL = 'https://fintoc.com/docs';


module.exports = {
  SCHEME,
  BASE_URL,
  USER_AGENT,
  DOCUMENTATION_URL,
};
