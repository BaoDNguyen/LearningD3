var margin = {top: 20, right: 200, bottom: 30, left: 40},
    width = 1024 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleLinear()
    .domain([1,100])
    .range(['yellow','red']);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var zoom = d3.zoom()
    .on("zoom", zoom);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "plot");

// generate random dataset
var randomX = d3.randomNormal(0, 30);
var randomY = d3.randomNormal(0, 30);

var data = d3.range(5000).map(function(d, i) {
    return {
        wt1: randomX(),
        wt2: randomY(),
        tc1: randomX(),
        tc2: randomY(),
        wt1C: randomX(),
        wt2C: randomY(),
        tc1C: randomX(),
        tc2C: randomY(),
        i: i, // save the index of the point as a property, this is useful
        selected: false
    };
});

data.forEach(function(d) {
    if(d.wt1 == 0 || d.wt2 ==0 || d.tc1 == 0 || d.tc2 == 0) {
        d.xlog = null;
        d.ylog = null;
    } else {
        d.xlog = Math.log(d.tc1 / d.wt1) / Math.log(2);
        d.ylog = Math.log(d.tc2 / d.wt2) / Math.log(2);
    }
});

x.domain(d3.extent(data, function(d) { return d.xlog; }));
y.domain(d3.extent(data, function(d) { return d.ylog; }));
//color.domain(d3.extent(data, function(d) { return d.wt1C+d.wt2C+d.tc1C+d.tc2C;}));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width/2)
    .attr("y", margin.bottom -5)
    .style("text-anchor", "middle")
    .text("14nov2013_yeast_stress_time0_1");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height/2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("14nov2013_yeast_stress_time0_2");

var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

var chartBody = svg.append("g")
    .attr("clip-path", "url(#clip)");

var circle = chartBody.selectAll(".dot")
    .data(data);

circle.enter().append("circle")
    .attr("class", "dot")
    .attr("r", 2.5)
    .attr("stroke-width", 0.1)
    .attr("transform", transform)
    .style("fill", function(d) {return color(d.wt1C+d.wt2C+d.tc1C+d.tc2C); })
    .style('cursor', 'pointer')
    .on('mouseover', displayData)
    .on('mouseout', removeDisplayedData)
    .append("title")
    .text(function(d) { return d.Gene;});

circle.filter(function(d) { return d.xlog == null;}).remove();

var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("circle")
    .attr("class", "dot")
    .attr("cx", width + 18)
    .attr("cy", 15)
    .attr("stroke-width", 0.1)
    .attr("r", 5)
    .style("fill", color);

legend.append("text")
    .attr("x", width + 32)
    .attr("y", 15)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; });

legend.append("text")
    .attr("x", width + 18)
    .attr("dy", 100)
    .attr("id", "blowup")
    .style("font-size", "30px")
    .style("font-weight", "bold");

// d3.tsv("data.tsv", function(error, data) {
//
//
//
// });

function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    svg.selectAll(".dot").attr("transform", transform);
}

function transform(d) {
    return "translate(" + x(d.xlog) +"," + y(d.ylog)+")";
}

function displayData(d, i) {

    d3.select(this)
        .attr("r",5);

    d3.select('svg #blowup')
        .text(d.Gene)
        .style("fill", function(d) {return color(d.wt1C+d.wt2C+d.tc1C+d.tc2C); })
        .transition()
        .style('opacity', 1);

}

function removeDisplayedData(d, i) {

    d3.select(this)
        .transition()
        .duration(500)
        .attr("r",2.5);

    d3.select('svg #blowup')
        .transition()
        .duration(1500)
        .style('opacity', 0);
}
