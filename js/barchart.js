// When clicking on country, the barchart should be updated with information about infection in the designated country, otherwise we should see information about global infections

/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */

BarChart = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    // TODO: define all constants here

    this.init();

}


/**
 * Method should be called as soon as data is available.. sets up the SVG and the variables
 */
BarChart.prototype.initVis = function(){

    var that = this; // read about the this

    this.svg = this.parentElement.select("svg");

    this.graphW = 500;
    this.graphH = 300;

    this.xScale = d3.scale.ordinal().rangeBands([0,this.graphW],.1).domain(d3.range(0,15));
    // xScale and xAxis stays constant

    this.yScale = d3.scale.linear().range([this.graphH,0]);

    this.xAxis = d3.svg.axis().scale(this.xScale);
    // xScale and xAxis stays constant

    this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");

    // visual elements
    this.visG = this.svg.append("g").attr({
        "transform":"translate("+60+","+10+")"
    })

    // xScale and xAxis stays constant:
    // copied from http://bl.ocks.org/mbostock/4403522
    this.visG.append("g")
            .attr("class","xAxis axis")
            .attr("transform","translate(0,"+this.graphH+")")
        .call(this.xAxis)
        .selectAll("text")
            .attr("y", 3) // magic number
            .attr("x", 10) // magic number
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start")
            .text(function(d){ return that.metaData.priorities[d]["item-title"];});



    this.visG.append("g").attr("class","yAxis axis")

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
BarChart.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};

}

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
BarChart.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};

    var that = this;

    // update the scales :
    var minMaxY =[0, d3.max(this.displayData)];
    this.yScale.domain(minMaxY);
    this.yAxis.scale(this.yScale);

    // draw the scales :
    this.visG.select(".yAxis").call(this.yAxis);





    var bars = this.visG.selectAll(".bar").data(this.displayData)
    bars.exit().remove();
    bars.enter().append("rect")
        .attr({
            "class":"bar",
            "width":that.xScale.rangeBand(),
            "x":function(d,i){return that.xScale(i);}
        }).style({
            "fill":function(d,i){return that.metaData.priorities[i]["item-color"];}
        });

    bars.attr({
        "height":function(d){return that.graphH-that.yScale(d)-1;},
        "y":function(d){return that.yScale(d);}
    })





    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs


}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
BarChart.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // call wrangleData with a filter function
    this.wrangleData(function(data){
        return (data.time<=selectionEnd && data.time>=selectionStart)
    })

    this.updateVis();


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
BarChart.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    //var filter = function(){return true;}
    //if (_filter != null){
    //    filter = _filter;
    //}
    //Dear JS hipster, a more hip variant of this construct would be:
     var filter = _filter || function(){return true;}

    var that = this;

    // create an array of values for age 0-99
    var res = d3.range(0,15).map(function () {
        return 0;
    });


    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values
    this.data.filter(filter).forEach(function(datum){
        d3.range(0,15).forEach(function(index){
            res[index] += datum.prios[index];
        })
    })

    return res;

}