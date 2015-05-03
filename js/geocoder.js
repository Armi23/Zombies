// Given click on country, launch simulation
function clickCountry (lat, lng) {
    requestGeocode(lat, lng, launchModel, null);
}

// Get info about latitude and longitude
function requestGeocode(lat, lng, callback, options) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            alert("TOO MUCH");
            return null;
        }
        if (status == google.maps.GeocoderStatus.OK) {
            first = results[0]; // Assume results have same country

            callback(first, lat, lng, options)
        }

        else {
            // alert('Geocoder failed due to: ' + status);
            console.log('Geocoder failed due to: ');
            console.log(status);
        }
    });
}