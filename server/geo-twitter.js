/**
 * @author tom@0x101.com
 * @class GeoTwitter
 *
 * Filter tweets in a world map, it uses the Google prediction API to apply filters.
 * - Retrieve tweets from the Twitter API
 * - Apply the user defined filters + Google prediction API
 *
 * http://geo-twitter.tomasperez.com
 *
 * Public Domain.
 * No warranty expressed or implied. Use at your own risk.
 */
var ApiClientFactory = require('./node-api-client/api-client').ApiClientFactory,
  ApiClientTypes = require('./node-api-client/api-client').Types;

var GeoTwitter = function(config) {
  this.config = config;
};

GeoTwitter.prototype = {
  /**
   * Filter tweets based on user defined parameters.
   * @author tom@0x101.com
   * @param {Function} callback
   * @param {Object} params
   */
  filterTweets: function(callback, params) {
    params.maxTweets = this.config['twitter-max-tweets'];
    var twitterStreamClient = ApiClientFactory.get(ApiClientTypes.TWITTER_STREAM, this.config);
    twitterStreamClient.search(params, callback);
  }
};

/**
 * @param {Object} options
 */
module.exports = function(config) {
  /**
   * Initialize the configuration, if needed.
   * @var constants
   */
  if(typeof config === 'undefined') {
    var Setup = Setup || require('../../0x101.com-www/setup.js'),
      basedir = Setup.serverDirectory,
      Config = Config || require('../' + basedir + '/config.js');

    config = Config.get('geo-twitter');
  }

  return new GeoTwitter(config);
};
