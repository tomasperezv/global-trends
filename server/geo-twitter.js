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
	querystring = require('querystring');

var GeoTwitter = function(config) {
	/**
	 * Used to compose the filters query string
	 */
	this.AND = ' AND ';
	this.OR = ' OR ';
	this.config = config;
};

GeoTwitter.prototype = {
	/**
	 * @return {String} host
	 */
	_getTwitterSearchHost: function() {
		return this.config['twitter-search-url'];
	},
	
	/**
	 * @param {Object} filters
	 * @return {String} filters urlencoded
	 */
	_formatFilters: function(filters) {
		return querystring.stringify({'q': filters['data'].join(filters['type'])});
	},

	/**
	 * Return tweets based on the filters, asking to the Twitter Search API.
	 * @see https://dev.twitter.com/docs/api/1/get/search
	 * @param {Function} callback
	 * @param {Object} filters
	 */
	_getTweets: function(callback, filters, page) {

		var options = {
			host: this._getTwitterSearchHost(),
			port: 80,
			path: '/search.json?' + this._formatFilters(filters) + '&rpp=' + this.config['twitter-max-tweets'] + '&page=' + page,
			method: 'POST'
		};

		console.log('Asking to the Twitter Search API: ' + options.path);

		var req = http.request(options, function(res) {
			var output = '';
			res.setEncoding('utf8');

			res.on('data', function (chunk) {
				output += chunk;
			});

			res.on('end', function() {
				console.log('Successful request to Twitter Search API:' + res.statusCode + ' ' + output.length + ' bytes');
				callback(output);
			});
		});

		req.on('error', function(e) {
			console.log(e.message);
		});
		
		req.end();
	},

	/**
	 * Filter tweets based on user defined parameters.
	 * @author tom@0x101.com
	 * @param {Function} callback
	 * @param {Object} params
	 */
	filterTweets: function(callback, params) {
		var type = this.AND;
		if (params.type_and == 'false') {
			type = this.OR;
		}
		var filters = {
			'data': params.filters.split(' '),
			'type': type
		};
		if (typeof params.page === 'undefined') {
			params.page = 1;
		}
		this._getTweets(callback, filters, params.page);
	}
};

/**
 * @param {Object} options
 */
module.exports = function(config) {
	/**
	 * Initialize the configuration
	 * @var constants
	 */
	if(typeof(config) === 'undefined') {
		var Setup = Setup || require('../../0x101.com-www/setup.js'),
			basedir = Setup.serverDirectory,
			Config = Config || require('../' + basedir + '/config.js');
		config = Config.get('geo-twitter');
	}
	return new GeoTwitter(config);
};
