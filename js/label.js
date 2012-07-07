/**
 * @class Label
 * @see http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
 */
function Label(options) {
	// Store the options and set the values
	this.options = options;
	this.setValues(this.options);
	
	// Label specific
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
						'white-space: nowrap; border: 1px solid blue; ' +
						'padding: 2px; background-color: white';

	this.div_ = document.createElement('div');
	this.div_.style.cssText = 'position: absolute; display: none';
};

Label.prototype = new google.maps.OverlayView;

// Implement onAdd
Label.prototype.onAdd = function() {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);
	this.draw();
};

// Implement onRemove
Label.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
};

// Implement draw
Label.prototype.draw = function() {

	var projection = this.getProjection(),
		position = projection.fromLatLngToDivPixel(this.get('position'));

	this.div_.style.left = position.x + 'px';
	this.div_.style.top = position.y + 'px';
	this.div_.style.display = 'block';
	this.div_.innerHTML = this.options.content;
};
