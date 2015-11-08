/**
 * Node.js client application for test the connectivity with
 * the external API's.
 *
 * @author tom@0x101.com
 * @see https://github.com/tomasperezv/global-trends
 *
 * Public Domain.
 * No warranty expressed or implied. Use at your own risk.
 */

// Test the twitter search API
// Mock the Setup and Config, normally exposed by Blackbriar.
var mockConfig = {
  "twitter-search-url": "search.twitter.com",
  "twitter-max-tweets": 100,
  "twitter-consumer-key" : "",
  "twitter-consumer-secret": "",
  "twitter-access-token": "",
  "twitter-access-token-secret": "",
  "twitter-stream-time": 10000
};
var geoTwitter = require('../geo-twitter.js')(mockConfig);

// Test a simple request
var params = {
  type_and: false,
  filters: 'twitter test'
};

geoTwitter.filterTweets(function(result){
  console.log(result.text);
}, params);
