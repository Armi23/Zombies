d3.select(window).on("resize", throttle);

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 9])
            .on("zoom", move);


        var width = document.getElementById('container').offsetWidth;
        var height = width / 2;

        var topo,projection,path,svg,g;

        var graticule = d3.geo.graticule();

        var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

        setup(width,height);

        function setup(width,height){
          projection = d3.geo.mercator()
            .translate([(width/2), (height/2)])
            .scale( width / 2 / Math.PI);

          path = d3.geo.path().projection(projection);

          svg = d3.select("#container").append("svg")
              .attr("width", width)
              .attr("height", height)
              .call(zoom)
              .on("click", click)
              .append("g");

          g = svg.append("g");

        }

        d3.json("data/world-topo-min.json", function(error, world) {

          var countries = topojson.feature(world, world.objects.countries).features;

          topo = countries;
          draw(topo);

        });

        function draw(topo) {

          svg.append("path")
             .datum(graticule)
             .attr("class", "graticule")
             .attr("d", path);


          g.append("path")
           .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
           .attr("class", "equator")
           .attr("d", path);


          var country = g.selectAll(".country").data(topo);

          country.enter().insert("path")
              .attr("class", "country")
              .attr("d", path)
              .attr("id", function(d,i) { return d.id; })
              .attr("title", function(d,i) { return d.properties.name; })
              .style("fill", "green");        //function(d, i) { return d.properties.color; });

          //offsets for tooltips
          var offsetL = document.getElementById('container').offsetLeft+20;
          var offsetT = document.getElementById('container').offsetTop+10;

          //tooltips
          country
            .on("mousemove", function(d,i) {

              var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

              tooltip.classed("hidden", false)
                     .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                     .html(d.properties.name);

              })
              .on("mouseout",  function(d,i) {
                tooltip.classed("hidden", true);
              });


          //EXAMPLE: adding some capitals from external CSV file
        //  d3.csv("data/country-capitals.csv", function(err, capitals) {
        //
        //    capitals.forEach(function(i){
        //      addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
        //    });
        //
        //  }); // WE DON'T NEED

        }


        function redraw() {
          width = document.getElementById('container').offsetWidth;
          height = width / 2;
          d3.select('svg').remove();
          setup(width,height);
          draw(topo);
        }


        function move() {

          var t = d3.event.translate;
          var s = d3.event.scale;
          zscale = s;
          var h = height/4;


          t[0] = Math.min(
            (width/height)  * (s - 1),
            Math.max( width * (1 - s), t[0] )
          );

          t[1] = Math.min(
            h * (s - 1) + h * s,
            Math.max(height  * (1 - s) - h * s, t[1])
          );

          zoom.translate(t);
          g.attr("transform", "translate(" + t + ")scale(" + s + ")");

          //adjust the country hover stroke width based on zoom level
          d3.selectAll(".country").style("stroke-width", 0.5 / s)
              .on("mouseover", function(d,i) {
                d3.select(this).style("stroke-width", 1.5 / s)
                })
              .on("mouseout", function(d,i) {
                d3.select(this).style("stroke-width", 0.5 / s)
                })
        }



        var throttleTimer;
        function throttle() {
          window.clearTimeout(throttleTimer);
            throttleTimer = window.setTimeout(function() {
              redraw();
            }, 200);
        }


        //geo translation on mouse click in map
        function click() {
          var latlon = projection.invert(d3.mouse(this));
          var country = clickCountry(latlon[1], latlon[0]);
        }


        //function to add points and text to the map (used in plotting capitals)
        function addpoint(lat,lon,text) {

          var gpoint = g.append("g").attr("class", "gpoint");
          var x = projection([lat,lon])[0];
          var y = projection([lat,lon])[1];

          gpoint.append("svg:circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("class","point")
                .attr("r", 1.5);

          //conditional in case a point has no associated text
          if(text.length>0){

            gpoint.append("text")
                  .attr("x", x+2)
                  .attr("y", y+2)
                  .attr("class","text")
                  .text(text);
          }

        }

        var year = 2013 // Latest density models use densities from 2013
        var country_index = 5 // For google reverse geocoding
        var comp = "address_components" // Key to parse out country names
        var airports = {}
        var densities = {}
        var migrations = {}
        var areas = {}

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



        $(function() {
        	d3.csv("data/airports.dat", function(csv) {
        		for (var i = 0; i < csv.length; i++) {
        			if (!(csv[i].country in airports)) {
        				airports[csv[i].country] = []
        			}

        			new_aiport = {
        				"lat": csv[i].lat,
        				"lng": csv[i].lng,
        				"id": csv[i].id
        			}

        			airports[csv[i].country].push(new_aiport)
        		};
        		// console.log(airports);
        	});

        	d3.csv("data/densities.csv", function(csv) {
        		for (var i = 0; i < csv.length; i++) {
        			densities[csv[i]["Country Name"]] = csv[i][year]
        		};
        		// console.log(densities);
        	});

        	d3.csv("data/migration.csv", function(csv) {
        		for (var i = 0; i < csv.length; i++) {
        			out_country = csv[i]["Source"]
        			migrations[out_country] = {}

        			for (var key in csv[i]) {
        				migrations[out_country][key] = csv[i][key]
        			}
        		};
        		// console.log(migrations);
        	});

        	d3.csv("data/area.csv", function(csv) {
        		for (var i = 0; i < csv.length; i++) {
					areas[csv[i]["Country Name"]] = csv[i][year]
        		};
        		// console.log(areas);
        	});
        })