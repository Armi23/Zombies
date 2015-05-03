// Given click on country, launch simulation
function clickCountry (lat, lng) {
    country = getCountry(lat, lng);
    
    if (country == null) {
        console.log("Could not start simulation");
        return;
    }

    launchModel(country, lat, lng);
}

function getCountry (lat, lng) {
    var comp = "address_components" // Key to parse out country names
    var geocode = requestGeocode(lat, lng); // Get country info

    // Iterate through properties of result to find country
    var country = null
    for (var i = 0; i < geocode[comp].length; i++) {
        if (geocode[comp][i].types[0] == "country") {
            country = geocode[comp][i]["long_name"]
        }
    };

    if (country == null) {
        "Could not find country"
    }

    return country;
}


// Get info about latitude and longitude
function requestGeocode(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            alert("TOO MUCH");
            return null;
        }
        if (status == google.maps.GeocoderStatus.OK) {
            first = results[0]; // Assume results have same country

            return first
        }
    });
}