
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 100,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



d3.csv("../data/merged_rides.csv").then(function(rideData){

  var parseTime = d3.timeParse("%Y-%m-%d");

    rideData.forEach(function(data){
      data.starttime = parseTime(data.starttime);
      data.tripduration = +data.tripduration;
      data.rides = +data.rides
    });

    var xTimeScale = d3.scaleTime()
      .domain(d3.extent(rideData, d=> d.starttime))
      .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(rideData, d => d.tripduration)])
    .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(rideData, d => d.rides)])
    .range([height, 0]);


    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%m-%Y"));
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);


    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
    chartGroup.append("g").call(leftAxis);

  // Add rightAxis to the right side of the display
    chartGroup.append("g").attr("transform", `translate(${width}, 0)`).call(rightAxis);


    var line1 = d3
    .line()
    .x(d => xTimeScale(d.starttime))
    .y(d => yLinearScale1(d.tripduration));

    var line2 = d3
    .line()
    .x(d => xTimeScale(d.starttime))
    .y(d => yLinearScale2(d.rides));

   chartGroup.append("path")
   .data([rideData])
   .attr("d", line1)
   .classed("line green", true);

   chartGroup.append("path")
   .data([rideData])
   .attr("d", line2)
   .classed("line orange", true);

   var circlesGroup = chartGroup.append("g")
        .attr("id", "durationCircles")
        .selectAll("circle")
        .data(rideData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.starttime))
        .attr("cy", d => yLinearScale1(d.tripduration))
        .attr("r", "5")
        .attr("fill", "green")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

  var circlesGroup2 = chartGroup.append("g")
        .attr("id", "ridesCircles")
        .selectAll("circle")
        .data(rideData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.starttime))
        .attr("cy", d => yLinearScale2(d.rides))
        .attr("r", "5")
        .attr("fill", "orange")
        .attr("stroke-width", "1")
        .attr("stroke", "black");


   var dateFormatter = d3.timeFormat("%m-%Y");



   var ridesTip = d3.tip()
    .attr("id", "ridestip")
    .offset([80,-30])
    .html(function(d){
      return(`<strong>${dateFormatter(d.starttime)}<strong><h4>${d.rides}
    rides</h4>`);
  });

   var durationTip = d3.tip()
    .attr("id", "durationtip")
    .offset([80, 30])
    .html(function(d){
      return(`<strong>${dateFormatter(d.starttime)}<strong><h4>${parseInt(d.tripduration)}
    seconds</h4>`);
  });

  chartGroup.call(ridesTip);
  chartGroup.call(durationTip);



  circlesGroup.on("mouseover", function(d) {
        durationTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          durationTip.hide(d);
        });

  circlesGroup2.on("mouseover", function(d) {
        ridesTip.show(d, this);
      })
        .on("mouseout", function(d) {
          ridesTip.hide(d);
        });

  chartGroup.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (margin.left - 150) +","+(height/2)+")rotate(-90)")
    .style('color', 'white')  // text is drawn off the screen top left, move down and out and rotate
    .text("Average Time of Rides (seconds)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height+(margin.bottom/3))+")")  // centre below axis
    .text("Date");

  chartGroup.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (margin.right + 725) +","+(height/2)+")rotate(90)")  // centre below axis
    .text("Rides Per Month");



}).catch(function(error) {
  console.log(error);
});

console.log('dis');
