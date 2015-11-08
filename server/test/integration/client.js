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
// Mock the Setup and Config
var mockConfig = {
  "twitter-search-url": "search.twitter.com",
  "twitter-max-tweets": 5,
  "twitter-consumer-key" : "",
  "twitter-consumer-secret": "",
  "twitter-access-token": "",
  "twitter-access-token-secret": "",
  "twitter-stream-time": 1000
};

var geoTwitter = require('../../geo-twitter')(mockConfig);

// Test a simple request
var params = {
  type_and: false,
  filters: 'test'
};

geoTwitter.filterTweets(function(err, tweets){
  if (err) {
    console.log(err);
  } else {
    console.log('Filtered ' + tweets.length);
    console.log(tweets);
  }
}, params);
