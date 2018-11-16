// Constants
const APP_ID = "tYoPygXoTYqQ8Wa2KyaJ";
const APP_CODE = "Mdw0jv4ATW-4XLiGAWHvHg";

/**
 * Moves the map to display over Antalya
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToAntalya(map) {
	map.setCenter({ lat: 36.882373, lng: 30.708695 });
	map.setZoom(15);
}

/**
 * Removes all Info bubbles that were previously created
 *
 */
function removeInfoBubbles() {
	ui.getBubbles().forEach(bub => ui.removeBubble(bub));
}

/**
 * Creates an Info Bubble over the location
 *
 * @param  {Object} location		 location of the place, consists of lng and lat
 * @param  {string} content 		 string to be inserted as innerhtml of html string
 */
function createInfoBubble(location, content) {
	// Remove all other Info bubbles
	removeInfoBubbles();
	// Create info bubble
	var bubble = new H.ui.InfoBubble({ lat: location.lat, lng: location.lng }, {
		content: content
	});
	// Add info bubble to the UI:
	ui.addBubble(bubble);
}

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
	app_id: APP_ID,
	app_code: APP_CODE,
	useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
	tileSize: pixelRatio === 1 ? 256 : 512,
	ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById("map"), defaultLayers.normal.map, {
	pixelRatio: pixelRatio
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
moveMapToAntalya(map);
