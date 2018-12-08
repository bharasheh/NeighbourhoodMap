// List of locations. This should be loaded from database
var initialLocations = [
	// Islamic Centres
	{title: 'Birkenhead Islamic Centre', location: {lat: -36.810433, lng: 174.741308}, icon: 'islamicCentreIcon'}, // ChIJrXNwRVs4DW0RwVezTLKYyic
	{title: 'North Shore Islamic Centre', location: {lat: -36.766972, lng: 174.736872}, icon: 'islamicCentreIcon'}, // ChIJ4Sjq9Zs5DW0R8BGuD5WauJ4

	// Beaches
	{title: 'Takapuna Beach', location: {lat: -36.787771, lng: 174.774783}, icon: 'beacheIcon'}, // ChIJ5RH0En03DW0RaXRWiW2-EZg
	{title: 'Cheltenham Beach', location: {lat: -36.822018, lng: 174.80806 }, icon: 'beacheIcon'}, // ChIJc13I_sk3DW0R-74PA6dGJMM
	{title: 'Halls Beach', location: {lat: -36.818653, lng: 174.744472}, icon: 'beacheIcon'}, // ChIJo75MTWg4DW0Rhyk8SiYhu00
	{title: 'Devonport Beach', location: {lat: -36.831795, lng: 174.798483}, icon: 'beacheIcon'}, // ChIJaUPykdw3DW0RA84mFfT4nUE
	{title: 'Waiake Beach', location: {lat: -36.702731, lng: 174.751959}, icon: 'beacheIcon'}, // ChIJuZk2N_M6DW0RCl65BHzrQq4
	{title: 'Chelsea Bay Beach', location: {lat: -36.81789, lng: 174.727679}, icon: 'beacheIcon'}, // ChIJE4kWbYs4DW0RzngcWUhruKQ

	// Gas Stations
	{title: 'BP Gas Station', location: {lat: -36.798211, lng: 174.783493}, icon: 'gasStationIcon'}, // ChIJWdl1toI3DW0Rwnyyvy_C9V4
	{title: 'Z Gas Station', location: {lat: -36.785485, lng: 174.756885}, icon: 'gasStationIcon'}, // ChIJqWyakMg5DW0Rxzgi7JTUGBM
	{title: 'Mobil Gas Station', location: {lat: -36.768936, lng: 174.720444}, icon: 'gasStationIcon'}, // ChIJM9vG1A85DW0RVB3RFGIwpm4
	{title: 'Gull Gas Station', location: {lat: -36.811086, lng: 174.718274}, icon: 'gasStationIcon'}, // ChIJJSSxM-w4DW0RXv8_ZxqoiOw
	{title: 'Caltex Gas Station', location: {lat: -36.787889, lng: 174.699064}, icon: 'gasStationIcon'}, // ChIJvbbYtCg5DW0RCT6WkVX5oEA

	// Shopping Centres
	{title: 'Glenfield Mall', location: {lat: -36.781411, lng: 174.72136}, icon: 'shoppingCentreIcon'}, // ChIJTUNA1w85DW0Rq85I4RZt4Hg
	{title: 'Milford Centre', location: {lat: -36.771721, lng: 174.765911}, icon: 'shoppingCentreIcon'}, // ChIJk7N0_OY5DW0R5PcrHutodKI
	{title: 'Shore City Shopping Centre', location: {lat: -36.78779, lng: 174.770079}, icon: 'shoppingCentreIcon'} // ChIJre87r9c5DW0RiXznTXFNjVM
];

var Location = function(data) {
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.icon = ko.observable(data.icon);
}

var ViewModel = function() {
	var self = this;
	
	this.locationList = ko.observableArray([]);
	this.selectedLocation = ko.observable('');
	
	initialLocations.forEach(function(locationItem) {
		self.locationList.push(new Location(locationItem));
	});
	
	self.selectedLocation.subscribe(function(newLocation) {
		if (newLocation != undefined) {
			for (var i = 0; i < markers.length; i++) {
				if (markers[i].title === newLocation) {
					google.maps.event.trigger(markers[i], 'click');
				}
			}
		}
	});
}

var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	// Create a styles array to use with the map.
	var styles = [
		{
			featureType: 'water',
			stylers: [
				{ color: '#19a0d8' }
			]
		}, {
			featureType: 'administrative',
			elementType: 'labels.text.stroke',
			stylers: [
				{ color: '#ffffff' },
				{ weight: 6 }
			]
		}, {
			featureType: 'administrative',
			elementType: 'labels.text.fill',
			stylers: [
				{ color: '#e85113' }
			]
		}, {
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [
				{ color: '#efe9e4' },
				{ lightness: -40 }
			]
		}, {
			featureType: 'transit.station',
			stylers: [
				{ weight: 9 },
				{ hue: '#e85113' }
			]
		}, {
			featureType: 'road.highway',
			elementType: 'labels.icon',
			stylers: [
			{ visibility: 'off' }
			]
		}, {
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [
				{ lightness: 100 }
			]
		}, {
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [
				{ lightness: -100 }
			]
		}, {
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [
				{ visibility: 'on' },
				{ color: '#f0e4d3' }
			]
		}, {
			featureType: 'road.highway',
			elementType: 'geometry.fill',
			stylers: [
				{ color: '#efe9e4' },
				{ lightness: -25 }
			]
		}
	];

	// Constructor creates a new map - only centre and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -36.7614, lng: 174.7326},
		zoom: 12,
		styles: styles,
		mapTypeControl: false
	});
	
	var largeInfowindow = new google.maps.InfoWindow();
	
	// Create marker icon for each location category
	var islamicCentreIcon = makeMarkerIcon('25b14c');
	var beacheIcon = makeMarkerIcon('0080ff');
	var gasStationIcon = makeMarkerIcon('ff0000');
	var shoppingCentreIcon = makeMarkerIcon('ff7f27');
	
	// Create a marker for unknown categories
	var defaultIcon = makeMarkerIcon('0091ff');
	
	// Create a "highlighted location" marker colour for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');
	
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < initialLocations.length; i++) {
		// Get the position from the location array.
		var position = initialLocations[i].location;
		var title = initialLocations[i].title;
		var markerIcon = defaultIcon;
		switch(initialLocations[i].icon) {
			case 'islamicCentreIcon':
				markerIcon = islamicCentreIcon;
				break;
			case 'beacheIcon':
				markerIcon = beacheIcon;
				break;
			case 'islamicCentreIcon':
				markerIcon = islamicCentreIcon;
				break;
			case 'gasStationIcon':
				markerIcon = gasStationIcon;
				break;
			case 'shoppingCentreIcon':
				markerIcon = shoppingCentreIcon;
				break;
		}
		
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: markerIcon,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', (function(markerIconCopy) {
			return function() {
				this.setIcon(markerIconCopy);
			};
		})(markerIcon));
	
		// Show all locations on map by default
		showListings();
	}
}
			
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		// Clear the infowindow content to give the streetview time to load.
		infowindow.setContent('');
		infowindow.marker = marker;
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
		
		// Set at least the title in the info window
		infowindow.setContent('<div class="infowindow">'
			+ '<div>' + marker.title + '</div>');
		
		// Set additional marker info
		getMarkInformation(marker, infowindow);
		
		infowindow.setContent(infowindow.getContent() + '</div>');
		
		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
	}
}

function getMarkInformation(marker, infowindow) {
	// Get additional marker info using Foursquare API
	$.ajax({
		type: 'GET',
		url: 'https://api.foursquare.com/v2/venues/search?ll=' + marker.position.lat() + ',' + marker.position.lng() + '&query=' + marker.title + '&client_id=H5PX3RXEPHIJNWDLFNOPK2DKEX3TTGKGOSWM5ZXMTNY5XFHX&client_secret=VGD3AMUVMXIXQZNNO33APKESYMUKT5EGPHF1JVLDI4OZYZJG&v=20181209&limit=1',
		success: function(result) {
			// Handle or verify the server response if necessary.
			if (result) {
				if (result.response.venues.length > 0) {
					var markInformation = result.response.venues[0];
					if (markInformation.name === marker.title) {
						var markInformationHtml = infowindow.getContent()
							+ '<div>' + markInformation.location.country + '</div>'
							+ '<div>' + markInformation.location.formattedAddress + '</div>';
						if (markInformation.categories.length > 0) {
							markInformationHtml = markInformationHtml + '<div>' + markInformation.categories[0].name + '</div>';
						}
						markInformationHtml = markInformationHtml
							+ '<hr>'
							+ '<div class="powered-by-foursquare"><img src="img/powered-by-foursquare-blue.png" alt="Powered by Foursquare" class="powered-by-foursquare-image"/></div>';
						infowindow.setContent(markInformationHtml);
					}
				}
				
			} else {
				alert('Failed to make a server-side call. Check your configuration and console.');
			}
		},
		error: function(error) {
			alert('Failed to make a server-side call. Check your configuration and console.');
		}
	});
}

// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
}

// This function takes in a COLOUR, and then creates a new marker
// icon of that colour. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}

// This function starts when the user types in locations search.
function textSearchLocations(searchText) {
	var locationsList = document.getElementById('locations-list');
	var locationsListToAdd = [];
	var locationsListToRemove = [];
	
	for (var i = 0; i < markers.length; i++) {
		// Find if the marker already exists in the list
		var locationIndex = null;
		for (var j = 0; j < locationsList.length; j++) {
			if (locationsList.options[j].text === markers[i].title) {
				locationIndex = j;
			}
		}
		
		// Find the markers match the search criteria and update the map and the list
		if (markers[i].title.toLowerCase().includes(searchText.toLowerCase())) {
			markers[i].setMap(map);
			if (locationIndex === null) {
				locationsListToAdd.push(markers[i].title);
			}
		} else {
			markers[i].setMap(null);
			if (locationIndex !== null) {
				locationsListToRemove.push(locationsList[locationIndex].text);
			}
		}
	}
	
	// Remove filtered-out locations from the list
	for (var i = 0; i < locationsListToRemove.length; i++) {
		for (var j = 0; j < locationsList.length; j++) {
			if (locationsList.options[j].text === locationsListToRemove[i]) {
				locationsList.remove(j);
				break;
			}
		}
	}

	// Add filtered-in locations to the list
	for (var i = 0; i < locationsListToAdd.length; i++) {
		var option = document.createElement("option");
		option.text = locationsListToAdd[i];
		locationsList.add(option);
	}
}

// knockout.JS mapping
ko.applyBindings(new ViewModel());