// Run SIR Model here within blocks
R = 6371.0
alpha = 0.3
infected_blocks = []
not_surrounded = []

// Creates a new block with the proper density
function newBlock (country, lat, lng) {
	var people_density = densities[country];
	return {"S": people_density, "I": 0, "R": 0, "lat": lat, "lng": lng, "Neighbors": {
		"N": null,
		"E": null,
		"W": null,
		"S": null,
		"NE": null,
		"NW": null,
		"SE": null,
		"SW": null
	}};
};

// Runs one step of the SIR model on the block. Just returns on ocean block
function SIR (block) {
	if (block.ocean == true) {
		return;
	} 

	S = block.S;
	I = block.I;
	R = block.R;
	N = S + I + R;

	block.S -= S * I / N;
	block.I += (1 - alpha) * S * I / N ;
	block.R += alpha * S * I / N;
}

// Start the infection from this point
function launchModel (country, lat, lng) {

	// Click location is site of first Zombie
	var starter_block = newBlock(country, lat, lng)
	starter_block.S -= 1
	starter_block.I += 1

	// All the neighboring blocks are initialized as susceptible
	starter_block.Neighbors.N = newBlock(country, lat, lng);
	starter_block.Neighbors.E = newBlock(country, lat, lng);
	starter_block.Neighbors.W = newBlock(country, lat, lng);
	starter_block.Neighbors.S = newBlock(country, lat, lng);
	starter_block.Neighbors.NE = newBlock(country, lat, lng);
	starter_block.Neighbors.NW = newBlock(country, lat, lng);
	starter_block.Neighbors.SE = newBlock(country, lat, lng);
	starter_block.Neighbors.SW = newBlock(country, lat, lng);

	infected_blocks.push(starter_block)
	not_surrounded.push(starter_block)

	// Run the steps of the simulation (replace with ticks)
	window.setInterval(function() {
		for (var j = 0; j < infected_blocks.length; j++) {
			SIR(infected_blocks[j])
		};
		spread()
	}, 1000)
	console.log(infected_blocks);
}

// Find all the locations around this block that are not infected
function vulnerable_neighbors (block) {
	vulnerable = []
	for (var dir in block.Neighbors) {
		if (block.Neighbors[dir].I == 0 && block.Neighbors[dir].R == 0) {
			vulnerable.push(dir)
		}
	}

	return vulnerable;
}

// Stochastically have a zombie spread into an uninfected neighboring block
function spread () {
	console.log("spread!");

	// Select number of zombies that will spread
	spreading_zombies = Math.floor(Math.random() * not_surrounded.length) + 1;
	for (var i = 0; i < spreading_zombies; i++) {

		// Select a block to spread from
		spread_point = Math.floor(Math.random() * not_surrounded.length)

		// Get a list of uninfected neighbors and select one of them randomly
		vulnerable_list = vulnerable_neighbors(not_surrounded[spread_point])
		targetIndex = Math.floor(Math.random() * vulnerable_list.length)
		targetDir = vulnerable_list[targetIndex]

		// If this block is surrounded by infected, remove it. 
		if (vulnerable_list.length == 1) {
			not_surrounded.splice(spread_point, 1);
		} else if (vulnerable_list.length == 0) {
			return;
		}

		// Infect targeted block
		console.log(targetDir);
		target = not_surrounded[spread_point].Neighbors[targetDir]
		target.S -= 1
		target.I += 1
		infected_blocks.push(target)
		not_surrounded.push(target)
		console.log(target)
	};
}

function infectBlock (diseased_block, new_block, dir) {
	console.log("hi");
}

// Get the lat/long of a block in the given direction
function newLatLng (lat1, lng1, d, brng) {
	var lat2 = 0
	var lng2 = 0

	if (brng[0] == "N") {
		lat2 = lat1 + 1.0 / 111111
	} else if (brng[0] == "S") {
		lat2 = lat1 - 1.0 / 111111
	}

	if (brng[0] == "E" || brng[1] == "E") {
		lng2 = lng1 + 1.0 / (111111.0 * Math.cos(lat1))	
	} else if (brng[0] == "W" || brng[1] == "W") {
		lng2 = lng1 - 1.0 / (111111.0 * Math.cos(lat1))
	}

	return [lat1, lng2]
}