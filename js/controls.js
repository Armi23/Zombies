// This is where we will edit the parameters of the disease. We will have some presets for different diseases but we will also allow users to change these manually


var width = 200;
var height = 300;
var margin = 40;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([10, width-margin])
    .clamp(true);

var brush_s = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed_s);

var control_svg = d3.select("#controls").append("svg")
    .attr("width", width)
    .attr("height", height);

control_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 5 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider_s = control_svg.append("g")
    .attr("class", "slider")
    .call(brush_s);

slider_s.selectAll(".extent,.resize")
    .remove();

//slider.select(".background")
//    .attr("height", height);

var handle_s = slider_s.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 5 + ")")
    .attr("r", 9);

slider_s
    .call(brush_s.event);
//  .transition() // gratuitous intro!
//    .duration(750)
//    .call(brush.extent([70, 70]))
//    .call(brush.event);

function brushed_s() {
  var value_s = brush_s.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value_s = x.invert(d3.mouse(this)[0]);
    brush_s.extent([value_s, value_s]);
  }

  handle_s.attr("cx", x(value_s));
//  d3.select("body").style("background-color", d3.hsl(value, .8, .8));
    
    console.log("Sliding S: ", value_s);
}



// i slider

var brush_i = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed_i);

control_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2.5 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider_i = control_svg.append("g")
    .attr("class", "slider")
    .call(brush_i);

slider_i.selectAll(".extent,.resize")
    .remove();

//slider.select(".background")
//    .attr("height", height);

var handle_i = slider_i.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 2.5 + ")")
    .attr("r", 9);

slider_i
    .call(brush_i.event);
//  .transition() // gratuitous intro!
//    .duration(750)
//    .call(brush.extent([70, 70]))
//    .call(brush.event);

function brushed_i() {
  var value_i = brush_i.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value_i = x.invert(d3.mouse(this)[0]);
    brush_i.extent([value_i, value_i]);
  }

  handle_i.attr("cx", x(value_i));
//  d3.select("body").style("background-color", d3.hsl(value, .8, .8));
    
    console.log("Sliding I: ", value_i);
}


// r slider

var brush_r = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed_r);

control_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 1.7 + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(0)
      .tickPadding(12))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

var slider_r = control_svg.append("g")
    .attr("class", "slider")
    .call(brush_r);

slider_r.selectAll(".extent,.resize")
    .remove();

//slider.select(".background")
//    .attr("height", height);

var handle_r = slider_r.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + height / 1.7 + ")")
    .attr("r", 9);

slider_r
    .call(brush_r.event);
//  .transition() // gratuitous intro!
//    .duration(750)
//    .call(brush.extent([70, 70]))
//    .call(brush.event);

function brushed_r() {
  var value_r = brush_r.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value_r = x.invert(d3.mouse(this)[0]);
    brush_r.extent([value_r, value_r]);
  }

  handle_r.attr("cx", x(value_r));
//  d3.select("body").style("background-color", d3.hsl(value, .8, .8));
    
    console.log("Sliding R: ", value_r);
}

Controls.prototype.addSlider = function(svg){
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([1,.1]).range([200,0])

   var sliderDragged = function(){
       var value = Math.max(0, Math.min(200,d3.event.y));

       var sliderValue = sliderScale.invert(value);

       // TODO: do something here to deform the y scale
       that.yScale.exponent(sliderValue);


       d3.select(this)
           .attr("y", function () {
               return sliderScale(sliderValue);
           })

       that.updateVis({});
   }
   var sliderDragBehaviour = d3.behavior.drag()
       .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:200
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:sliderScale(1),
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)
}