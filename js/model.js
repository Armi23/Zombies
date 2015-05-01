// Run SIR Model here within blocks
function model (country, lat, lng) {
	console.log(country);
	console.log(Lat)
	var blocks = areas[country]
	var people_density = densities[country]

	var infected_block = {"S": people_density - 1, "I": 1, "R": 0, "Lat": Lat, "Lng": Lng, "Neighbors": []}
	console.log(infected_block)
}