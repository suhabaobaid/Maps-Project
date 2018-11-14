// Constants
const APP_ID = "tYoPygXoTYqQ8Wa2KyaJ";
const APP_CODE = "Mdw0jv4ATW-4XLiGAWHvHg";

/**
 * Moves the map to display over Berlin
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToBerlin(map) {
	map.setCenter({ lat: 36.883438, lng: 30.704852 });
	map.setZoom(16);
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
moveMapToBerlin(map);
