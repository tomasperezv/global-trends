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
var http = require('http'),
	querystring = require('querystring'),
	Setup = require('../../0x101.com-www/setup.js'),
	basedir = Setup.serverDirectory,
	Config = require('../' + basedir + "/config.js");

/**
 * Initialize the configuration
 * @var constants
 */
this.config = Config.get('geo-twitter');

/**
 * Used to compose the filters query string
 */
this.AND = ' AND ';
this.OR = ' OR ';

/**
 * @return {String} host
 */
this._getTwitterSearchHost= function() {
	return this.config['twitter-search-url'];
};

/**
 * @param {Object} filters
 * @return {String} filters urlencoded
 */
this._formatFilters = function(filters) {
	return querystring.stringify({'q': filters['data'].join(filters['type'])});
};

/**
 * Return tweets based on the filters, asking to the Twitter Search API.
 * @param {Function} callback
 * @param {Object} filters
 */
this._getTweets = function(callback, filters) {

	var options = {
		host: this._getTwitterSearchHost(),
		port: 80,
		path: '/search.json?' + this._formatFilters(filters) + '&rpp=' + this.config['twitter-max-tweets'],
		method: 'GET'
	};

	console.log('Asking to the Twitter Search API: ' + options.path);

	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (data) {
			console.log('Successful request to Twitter Search API:' + res.statusCode);
			callback(data);
		});
	});

	req.on('error', function(e) {
		console.log(e.message);
	});
	
	req.end();
};

/**
 * Filter tweets based on user defined parameters.
 * @author tom@0x101.com
 * @param {Function} callback
 * @param {Object} params
 */
this.filterTweets = function(callback, params) {
	// TODO: build the filters object based on the params
	var filters = {
		'data': ["blue", "cake"],
		'type': this.AND
	};
	this._getTweets(callback, filters);
};
