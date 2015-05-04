// Run SIR Model here within blocks
R = 6371.0
alpha = 0.3
infected_blocks = []
not_surrounded = []
list_of_blocks = {}

function infectBlockCallback (geocode, lat, lng, options) {
  var country = getCountry(geocode);
  infectBlockCountry(lat, lng, country, options[0], options[1]);
}

function infectBlockCountry (lat, lng, country, x_index, y_index) {
  var people_density = densities[country];
  var block = {"S": people_density * 100 - 1, 
      "I": 1, 
      "R": 0, 
      "lat": lat, 
      "lng": lng, 
      "x": x_index, 
      "y": y_index,
      "country": country
  }

  if (!(x_index in list_of_blocks)) {
    list_of_blocks[x_index] = {};
  }

  infected_blocks.push([x_index, y_index])
  not_surrounded.push([x_index, y_index])
  list_of_blocks[x_index][y_index] = block;
}

function infectBlock(fromBlock, dir, options) {
  lat1 = fromBlock.lat
  lng1 = fromBlock.lng
  new_lat_lng = newLatLng(lat1, lng1, dir);
  requestGeocode(new_lat_lng[0], new_lat_lng[1], infectBlockCallback, options)
};

// Runs one step of the SIR model on the block. Just returns on ocean block
function SIR (coord) {
  block = list_of_blocks[coord[0]][coord[1]]

  S = block.S;
  I = block.I;
  R = block.R;
  N = S + I + R;

  block.S -= S * I / N;
  block.I += (1 - alpha) * S * I / N ;
  block.R += alpha * S * I / N;
}

function getCountry (geocode) {
  // Iterate through properties of result to find country
  var comp = "address_components"; // Key to parse out country names
  var country = null;
  for (var i = 0; i < geocode[comp].length; i++) {
      if (geocode[comp][i].types[0] == "country") {
          country = geocode[comp][i]["long_name"];
      }
  };

  if (country == null) {
      alert("Could not find country");
  }

  return country;
}

// Start the infection from this point
function launchModel (geocode, lat, lng) {

  var country = getCountry(geocode)

  // Click location is site of first Zombie
  var starter_block = infectBlockCountry(lat, lng, country, 0, 0)

  // Run the steps of the simulation
  var timesRun = 0
  var interval = window.setInterval(function() {
    for (var j = 0; j < infected_blocks.length; j++) {
      SIR(infected_blocks[j])
    };
    spread();
    mapVis(list_of_blocks);

    timesRun += 1
    // console.log("Times run: " + timesRun);
    if (timesRun >= 100) {
      clearInterval(interval);
    }

  }, 2000)
}

// Find all the locations around this block that are not infected
function vulnerable_neighbors (x, y) {
  vulnerable = [];
  list = calculate_Neighbors(x, y);

  for (var dir in list) {
    item = list[dir]
    i = item[0]
    j = item[1]
    if (list_of_blocks[i] == undefined || (list_of_blocks[i][j] == null)) {
      vulnerable.push(item)
    }
  }

  return vulnerable;
}

// Stochastically have a zombie spread into an uninfected neighboring block
function spread () {
  console.log("spread!");

  // Select number of zombies that will spread
  // spreading_zombies = Math.floor(Math.random() * not_surrounded.length) + 1;
  spreading_zombies = 1;
  for (var i = 0; i < spreading_zombies; i++) {

    // Select a block to spread from
    point_index = Math.floor(Math.random() * not_surrounded.length)
    point = not_surrounded[point_index]

    // Get a list of uninfected neighbors and select one of them randomly
    vulnerable_list = vulnerable_neighbors(point[0], point[1])
    targetIndex = Math.floor(Math.random() * vulnerable_list.length)
    target = vulnerable_list[targetIndex]

    // If this block is surrounded by infected, remove it. 
    if (vulnerable_list.length == 1) {
      not_surrounded.splice(point_index, 1);
    } else if (vulnerable_list.length == 0) {
      not_surrounded.splice(point_index, 1);
      continue;
    }

    // Infect targeted block
    infectBlock(list_of_blocks[point[0]][point[1]], target[2], [target[0], target[1]])
  };
}

// Get the lat/long of a block in the given direction
function newLatLng (lat1, lng1, brng) {
  var lat2 = 0
  var lng2 = 0

  if (brng[0] == "N") {
    lat2 = lat1 + 10.0 / 111111
  } else if (brng[0] == "S") {
    lat2 = lat1 - 10.0 / 111111
  }

  if (brng[0] == "E" || brng[1] == "E") {
    lng2 = lng1 + 10.0 / (111111.0 * Math.cos(lat1)) 
  } else if (brng[0] == "W" || brng[1] == "W") {
    lng2 = lng1 - 10.0 / (111111.0 * Math.cos(lat1))
  }

  return [lat1, lng2]
}

function calculate_Neighbors (x_index, y_index) {
  return [
    [x_index - 1, y_index + 1, "NW"],
    [x_index, y_index + 1, "N"],
    [x_index + 1, y_index + 1, "NE"],
    [x_index - 1, y_index, "W"],
    [x_index + 1, y_index, "E"],
    [x_index - 1, y_index - 1, "SW"],
    [x_index, y_index - 1, "S"],
    [x_index + 1, y_index - 1, "SE"],
  ]
}