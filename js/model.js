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

// Runs one step of the SIR model on the block. Returns ocean block
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

function model (country, lat, lng) {
	console.log(country);
	console.log(lat)
	var blocks = areas[country]
	var people_density = densities[country]
	console.log(people_density)

	var starter_block = newBlock(country, lat, lng)
	starter_block.S -= 1
	starter_block.I += 1

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

	for (var i = 0; i < 5; i++) {
		for (var i = 0; i < infected_blocks.length; i++) {
			SIR(infected_blocks[i])
		};
		spread()
	};
}

function vulnerable_neighbors (block) {
	vulnerable = []
	for (var dir in block.Neighbors) {
		if (block.Neighbors[dir].I == 0) {
			vulnerable.push(dir)
		}
	}

	return vulnerable;
}

function spread () {
	spreadIndex = Math.floor(Math.random() * not_surrounded.length)
	vulnerable_list = vulnerable_neighbors(not_surrounded[spreadIndex])
	targetIndex = Math.floor(Math.random() * vulnerable_list.length)
	targetDir = vulnerable_list[targetIndex]

	target = not_surrounded[spreadIndex].Neighbors[targetDir]
	target.S -= 1
	target.I += 1

	console.log(targets)
}

function newLatLng (lat1, lng1, d, brng) {
	switch(brng) {
		case 0:
			lat2 = lat1 + 1.0 / 111111
			return [lat2, lng1]
		case 90:
			lng2 = lng1 + 1.0 / (111111.0 * Math.cos(lat1))
			return [lat1, lng2]
		case 180:
			lat2 = lat1 - 1.0 / 111111
			return [lat2, lng1]
		case 270:
			lng2 = lng1 - 1.0 / (111111.0 * Math.cos(lat1))
			return [lat1, lng2]
		default:
			alert("Bad lat / lng")

	}
}