/* jslint node: true */
/* global DOM, SimpleGoogleMaps, google */

/**
 * @class GeoTwitterClient
 * @author tom@0x101.com
 */
var GeoTwitterClient = {

  /**
   * @var {Map} map
   */
  map: null,

  /**
   * @var {WebSocket} websocket
   */
  websocket: null,

  /**
   * Stores the id's of the tweets that are displayed
   * @var {Object} _tweets
   */
  _tweets: [],

  /**
   * @var PROTOCOL Used to define the websocket protocol identifier.
   */
  PROTOCOL: 'blackbriar-0.1',

  init: function() {
    this._renderMap();
  },

  start: function() {
    this._retrieveData();
  },

  stop: function() {
    if (this.websocket !== null) {
      this.websocket.close();
      this.websocket = null;
    }
  },

  /**
   * Get data from the API
   */
  _retrieveData: function() {
    var self = GeoTwitterClient;

    // TODO: the uri needs to be generated.
    if (this.websocket === null) {
      this.websocket = new WebSocket('ws://geo-twitter.tomasperez.com:9000/', this.PROTOCOL);
    }

    this.websocket.onopen = function() {
      var params = {
        url: "/filterTweets",
        filters: DOM.get('filters').value,
        type_and: DOM.get('type_and').checked,
        type_or: DOM.get('type_or').checked
      };
      self.websocket.send(JSON.stringify(params));
    };

    this.websocket.onmessage = function(message) {
      self._getLocationsFromTwitterData(JSON.parse(message.data));
    };

    this.websocket.onclose = function() {
      console.log('closing websocket');
    };

  },

  /**
   * @param {Object} twitterData
   */
  _getLocationsFromTwitterData: function(twitterData) {
      var nLocations = twitterData.length,
      self = this;
    for (var i = 0; i < nLocations; i++) {
      var tweet = twitterData[i];
      if ( this._isValidTweet(tweet) ) {
        console.log('Adding tweet ' + tweet.id);

        self._renderLocation([tweet.text, tweet.geo.coordinates[0], tweet.geo.coordinates[1], tweet.id]);
        // Mark the tweet as displayed
        this._tweets[tweet.id] = true;
      }
    }
    if (this._tweets.length > 100) {
      this.websocket.close();
    }
  },

  /**
   * Can this tweet be added to the map?
   * @param {Array} tweet
   */
  _isValidTweet: function(tweet) {
    return tweet.geo !== null && (typeof this._tweets[tweet.id] === 'undefined');
  },

  /**
   * Creates the map.
   */
  _renderMap: function() {
    if (this.map === null) {
      this.map = new SimpleGoogleMaps.Map({
        div: DOM.get('map'),
        zoom: 5
      });
    }
    this._centerMap();
    var self = this;
    this.map.searchByAddress('Stockholm', function(position) {
      self.map.addLabel(position, 'Stockholm');
    });
  },

  _centerMap: function() {
    if (this.map !== null) {
      this.map.center('Europe');
    }
  },

  /**
   * @param {Array} locationData
   */
  _renderLocation: function(locationData) {
    if (this.map !== null) {

      // Creates the marker, based on the location data
      var position = this.map.getPosition(locationData[1], locationData[2]),
        marker = this.map.addMarker(position),
        label = this.map.addLabel(position, locationData[0], 'label_' + locationData[3]),
        self = this;

      google.maps.event.addListener(marker, 'click', function() {
        if (label.map !== null) {
          label.setMap(null);
        } else {
          label.setMap(self.map.getGoogleMap());
        }
      });
    }
  }
};
