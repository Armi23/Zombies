function clickCountry(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            first = results[0]; // Assume results have same country

            // Iterate through properties of result to find country
            for (var i = 0; i < first[comp].length; i++) {
                if (first[comp][i].types[0] == "country") {
                    var country = first[comp][i]["long_name"]
                    model(country, lat, lng);
                }
            };
        }
    });
}