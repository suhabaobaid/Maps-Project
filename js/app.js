/* Helper functions */


/* Location Model */
function Location(data) {
	this.id = ko.observable(data.id);
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
}


/* View Model */
function ViewModel() {

	// Create the markers and custom icon
	var markers = [];
	var customIcon = new H.map.Icon("http://www.discoveralbania.al/wp-content/uploads/2017/05/pin1.png", {size: {w: 56, h: 56}});
	var defaultIcon = new H.map.Icon("http://www.uidownload.com/files/402/318/362/arrow-coordinates-direction-location-locations-marker-navigation-icon.png", {size: {w: 56, h:56}});
	var self = this;

	// Create the observables
	self.locationList = ko.observableArray([]);
	self.searchInput = ko.observable("");
	self.selectedLocation = ko.observable();

	locations.forEach(function(l) {
		self.locationList.push(new Location(l));
		let marker = (new H.map.Marker({lat: l.location.lat, lng: l.location.lng}))
			.setIcon(defaultIcon)
			.setData({ name: l.name, location: l.location });
		markers.push(marker);
		marker.addEventListener('tap', function (evt){
			console.log(evt.target.getData());
		});
	});

	// Create a computed observable to be the filtered array
	self.filteredLocations = ko.computed(function() {
		return self.locationList().filter(function(l, index) {
			if (l.name().toLowerCase().includes(self.searchInput().toLowerCase())) {
				let marker = (markers[index]).setVisibility(true)
				map.addObject(marker);
				return true;
			}
			map.addObject((markers[index]).setVisibility(false));
			return false;
		});
	});

	// Invoked when a location in the list is clicked
	self.setSelectedLocation = function(l) {
		if (self.selectedLocation()) {
			map.addObject((markers[self.selectedLocation().id() - 1]).setIcon(defaultIcon));
		}
		self.selectedLocation(l);
		map.addObject((markers[l.id() - 1]).setIcon(customIcon));
		createInfoBubble(self.selectedLocation().location());
	}
}

ko.applyBindings(new ViewModel());