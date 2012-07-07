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
	 * @var {Integer} intervalId
	 */
	intervalId: null,

	/**
	 * @const {Integer} INTERVAL
	 */
	INTERVAL: 3000,

	/**
	 * Stores the id's of the tweets that are displayed
	 * @var {Object} _tweets
	 */
	_tweets: [],

	/**
	 * @var {Integer} _pageNumber
	 */
	_pageNumber: 1,

	/**
	 * @const {Integer} MAX_PAGE
	 */
	MAX_PAGE: 15,

	init: function() {
		this._renderMap();
		AjaxEngine.appUrl = 'http://api.tomasperez.com:9000/';
	},

	start: function() {
		if (this.intervalId === null) {
			this.intervalId = window.setInterval(this._retrieveData, this.INTERVAL);
		}
	},

	stop: function() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	},

	/**
	 * Get data from the API
	 */
	_retrieveData: function() {
		var self = GeoTwitterClient;

		self._pageNumber++;

		AjaxEngine.post(
			'filterTweets',
			{	filters: DOM.get('filters').value,
				type_and: DOM.get('type_and').checked,
				type_or: DOM.get('type_or').checked,
				page: self._pageNumber
			},
			function(result) {
				if (typeof result.results !== undefined) {
					var locations = self._getLocationsFromTwitterData(result);
					self._addLocations(locations);
				}
			}
		);

		// We reach the limit, don't perform more requests
		if (self._pageNumber == self.MAX_PAGE) {
			self.stop();
		}

	},

	/**
	 * @param {Object} twitterData
	 */
	_getLocationsFromTwitterData: function(twitterData) {
		var locations = [],
			nLocations = twitterData.results.length;
		for (var i = 0; i < nLocations; i++) {
			var tweet = twitterData.results[i];
			if ( this._isValidTweet(tweet) ) {
				console.log('Adding tweet ' + tweet.id);
				locations.push([tweet.text, tweet.geo.coordinates[0], tweet.geo.coordinates[1], tweet.id]);
				// Mark the tweet as displayed
				this._tweets[tweet.id] = true;
			}
		}
		return locations;
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
		this.map = new google.maps.Map(DOM.get('map'), {
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this._centerMap();
	},

	_centerMap: function() {
		var self = this,
			geocoder = new google.maps.Geocoder();

		geocoder.geocode( { 'address': 'Europe'}, function(results, status) { 
			if (status == google.maps.GeocoderStatus.OK) {
				self.map.setCenter(results[0].geometry.location);
			}
		});
	},

	/**
	 * Add locations data, creating new markers.
	 * @param {Array} locations
	 */
	_addLocations: function(locations) {
		for (i = 0; i < locations.length; i++) {
			this._renderLocation(locations[i], 'marker_' + i);
		}
	},

	/**
	 * @param {Array} locationData
	 */
	_renderLocation: function(locationData, id) {
		if (this.map !== null) {
			// Creates the marker, based on the location data
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(locationData[1], locationData[2]),
				map: this.map,
				visible: true
			});

			var label = new Label({
				map: this.map,
				content: '<div class="infowindow">' + locationData[0] + '</div>'
			});
			label.bindTo('position', marker, 'position');

			var self = this;
			google.maps.event.addListener(marker, 'click', function() { 
				if (label.map !== null) {
					label.setMap(null);
				} else {
					label.setMap(self.map);
				}
			});
		}
	}
};