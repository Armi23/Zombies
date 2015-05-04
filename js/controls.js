// This is where we will edit the parameters of the disease. We will have some presets for different diseases but we will also allow users to change these manually


// initializer
// init >> add vis elements
// update



Controls = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    this.init();
}


//function start(){
//    console.log("Clicked Start!");
//}

Controls.prototype.init = function(){

    var that = this; // read about the this

    this.svg = d3.select("#control svg");

    this.graphW = 200;
    this.graphH = 270;
    
    this.addSlider(this.svg);
    
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