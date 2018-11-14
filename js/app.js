/* Location Model */
function Location(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
}


/* View Model */
function ViewModel() {

	// Create the markers
	var markers = [];

	var self = this;

	// Create the observables
	self.locationList = ko.observableArray([]);
	self.searchInput = ko.observable("");
	self.selectedLocation = ko.observable();

	locations.forEach(function(l) {
		self.locationList.push(new Location(l));
		markers.push(new H.map.Marker({lat: l.location.lat, lng: l.location.lng}));
	});

	// add all markers to the map
	map.addObjects(markers);

	// Create a computed observable to be the filtered array
	self.filteredLocations = ko.computed(function() {
		return self.locationList().filter(function(l, index) {
			if (l.name().toLowerCase().includes(self.searchInput().toLowerCase())) {
				map.addObject(markers[index]);
				return true;
			}
			map.removeObject(markers[index]);
			return false;
		});
	});

	// Invoked when a location in the list is clicked
	self.setSelectedLocation = function(location) {
		self.selectedLocation(location);
	}
}

ko.applyBindings(new ViewModel());