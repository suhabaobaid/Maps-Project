/* Constants */
const PIC_SIZE = '100x100';

const FORESQUARE_CLIENT_ID = 'FBO5NACEDE3T1NIUT1W3X2LMSA2X5ANDBVEYYRUHGP4SQ3XW';
const FORESQUARE_CLIENT_SECRET = 'NI1GIII3UJYRPOP3Y04SDD5GNYXCNALG5K4112DWARSEJPMF';
const FORESQURE_AUTH = `
	client_id=${FORESQUARE_CLIENT_ID}&
	client_secret=${FORESQUARE_CLIENT_SECRET}&v=20180323&`;

const VENUE_SEARCH_URL = `
	https://api.foursquare.com/v2/venues/search?${FORESQURE_AUTH}`;


/* Helper functions */

/**
 * constructs the image received from FORESQUARE
 *
 * @param {Object} imageInfo	object consisting of image details
 */
function constructImage(imageInfo) {
	return imageInfo.prefix + PIC_SIZE + imageInfo.suffix;
}

/**
 * Blocks the UI with a please wait message to enhance user experience
 */
function blockUI() {
	$.blockUI({ css: {
		border: 'none',
		padding: '15px',
		backgroundColor: '#000',
		'-webkit-border-radius': '10px',
		'-moz-border-radius': '10px',
		opacity: .5,
		color: '#fff'
	} });
}

/**
 * Unblocks the UI
 */
function unblockUI() {
	$.unblockUI();
}

/**
 * gets the venue information and image
 * constructs an infobubble with information upon success
 * or alerts error upon failure of the request
 *
 * @param {Object} venue	object consisting of venue
 */
function getVenueInfo(venue) {
	blockUI();
	$.ajax({
		url: `${VENUE_SEARCH_URL}ll=${venue.location.lat},${venue.location.lng}&query=${venue.name}`,
		success: function(result) {
			if (result.response.venues[0]) {
				let resultVenue = result.response.venues[0];
				let content = `
					<h6>${venue.name}</h6>
					<p class="bubble-info">address: ${resultVenue.location.address}</p>`;
				$.ajax({
					url: `https://api.foursquare.com/v2/venues/${resultVenue.id}/photos?${FORESQURE_AUTH}`,
					success: function(result) {
						// if there are photos of the place
						if(result.response.photos.count > 0) {
							// Get the first image only
							let imageInfo = result.response.photos.items[0];
							content += `
								<img src="${constructImage(imageInfo)}">
							`;
						}
						unblockUI();
						createInfoBubble(venue.location, content);
					},
					error: function(error) {
						unblockUI();
						alert(`An error has occurred: ${error.status},  ${error.statusText}`);
					},
				});
			}
		},
		error: function(error) {
			unblockUI();
			alert(`An error has occurred: ${error.status},  ${error.statusText}`);
		},
	});
}

/* Location Model */
function Location(data) {
	this.id = ko.observable(data.id);
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
}


/* ViewModel */
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

	// Create markers and save them
	locations.forEach(function(l) {
		self.locationList.push(new Location(l));
		let marker = (new H.map.Marker({lat: l.location.lat, lng: l.location.lng}))
			.setIcon(defaultIcon)
			.setData({ name: l.name, location: l.location });
		markers.push(marker);
		marker.addEventListener('tap', function (evt){
			getVenueInfo(evt.target.getData());
		});
	});

	// Create a computed observable to be the filtered array
	self.filteredLocations = ko.computed(function() {
		return self.locationList().filter(function(l, index) {
			if (l.name().toLowerCase().includes(self.searchInput().toLowerCase())) {
				let marker = (markers[index]).setVisibility(true)
				map.addObject(marker);
				removeInfoBubbles();
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
		getVenueInfo({
			name: self.selectedLocation().name(),
			location: self.selectedLocation().location()
		});
	}
}

ko.applyBindings(new ViewModel());