/* Location Model */
function Location(data) {
	this.name = ko.observable(data.name);
}


/* View Model */
function ViewModel() {

	var self = this;

	// Create the observables
	self.locationList = ko.observableArray([]);
	self.searchInput = ko.observable("");
	self.selectedLocation = ko.observable();

	locations.forEach(function(location) {
		self.locationList.push(new Location(location));
	});

	// Create a computed observable to be the filtered array
	self.filteredLocations = ko.computed(function() {
		if(!self.searchInput) {
			return self.locationList();
		} else {
			return self.locationList().filter(function(location) {
				return location.name().toLowerCase().includes(self.searchInput().toLowerCase());
			});
		}
	});

	// Invoked when a location in the list is clicked
	self.setSelectedLocation = function(location) {
		self.selectedLocation(location);
	}
}

ko.applyBindings(new ViewModel());