const chartWidth = $("#chart").width()
let tickCount = 12
if (chartWidth < 600) {
    tickCount = 4
}

const margin = { top: 10, right: 30, bottom: 30, left: 72 },
    width = chartWidth - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


let tooltip = d3.select("body")
    .append("div")
    .append("p")
    .style("font-family", "Poppins")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#262B28")
    .style("padding-top", "5px")
    .style("padding-bottom", "5px")
    .style("padding-right", "5px")
    .style("padding-left", "5px")
    .style("border-radius", "5px")
    .style("color", "#F3F4F2")

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let div = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background", "#262B28")
    .style("padding", "0px")
    .style("border-radius", "5px")
    .style("color", "#F3F4F2");

d3.csv("https://raw.githubusercontent.com/aadittambe/thanksgiving-travel/main/tsa.csv",

    function (d) {
        return { date: d3.timeParse("%-b. %-d")(d.formatted_date), throughput22: d["2022-throughput"], throughput21: d["2021-throughput"], throughput20: d["2020-throughput"], throughput19: d["2019-throughput"] }
    }).then(

        function (data) {

            data = _.sortBy(data, 'date');


            // console.log(data)
            let x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.date; }))
                .range([0, width]);
            let xTicks = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x)
                    .tickFormat(function (d) {
                        return formatDateMonth(d)
                    })
                    .ticks(tickCount)
                );

            xTicks.selectAll('text')
                .attr("font-size", "1.1em")
                .attr("font-family", "Poppins")
                .attr("color", "#0a0a0a")

            let y = d3.scaleLinear()
                .domain([0, 3000000])
                .range([height, 0]);
            let yTicks = svg.append("g")
                .call(d3.axisLeft(y));

            yTicks.selectAll('text')
                .attr("font-size", "1.1em")
                .attr("font-family", "Poppins")
                .attr("color", "#0a0a0a")

            let line1 = svg.append("path")
                .datum(data.filter(function (d) {
                    // console.log(d)
                    return d.throughput22 !== "undef"
                }))
                .attr("fill", "none")
                .attr("stroke", "#990000")
                .attr("stroke-width", 1.5)
                .attr("opacity", "1")
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) {
                        return y(d.throughput22)
                    })
                )

            let line2 = svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#2ec4b6")
                .attr("stroke-width", 1.5)
                .attr("opacity", ".75")
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.throughput21) })
                )

            let line3 = svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#faa916")
                .attr("stroke-width", 1.5)
                .attr("opacity", ".75")
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.throughput20) })
                )

            let line4 = svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#666666")
                .attr("stroke-width", 1.5)
                .attr("opacity", ".75")
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.throughput19) })
                )

            let dot1 = svg.selectAll("dot")
                .data(data.filter(function (d) {
                    return d.throughput22 !== "undef"
                }))
                .enter().append("circle")
                .attr("r", 2)
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.throughput22); })
                .style("fill", "#990000")
                .on("mouseover", function (d, i) {
                    //console.log(i.value)
                    let num = (Math.round(i.throughput22 * 10) / 10).toLocaleString("en-US")
                    let date = formatDateMonth(i.date)
                    tooltip.text(`${date}: ${num}`);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function (e) {
                    // console.log(e)
                    return tooltip
                        .style("top", (e.pageY - 10) + "px")
                        .style("left", (e.pageX + 10) + "px");

                })
                .on("mouseout", function () {
                    return tooltip
                        .style("visibility", "hidden");
                });

            let dot2 = svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 2)
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.throughput21); })
                .style("fill", "#2ec4b6")
                .attr("opacity", ".75")
                .on("mouseover", function (d, i) {
                    //console.log(i.value)
                    let num = (Math.round(i.throughput21 * 10) / 10).toLocaleString("en-US")
                    let date = formatDateMonth(i.date)
                    tooltip.text(`${date}: ${num}`);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function (e) {
                    // console.log(e)
                    return tooltip
                        .style("top", (e.pageY - 10) + "px")
                        .style("left", (e.pageX + 10) + "px");

                })
                .on("mouseout", function () {
                    return tooltip
                        .style("visibility", "hidden");
                });

            let dot3 = svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 2)
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.throughput20); })
                .style("fill", "#faa916")
                .attr("opacity", ".75")
                .on("mouseover", function (d, i) {
                    //console.log(i.value)
                    let num = (Math.round(i.throughput20 * 10) / 10).toLocaleString("en-US")
                    let date = formatDateMonth(i.date)
                    tooltip.text(`${date}: ${num}`);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function (e) {
                    // console.log(e)
                    return tooltip
                        .style("top", (e.pageY - 10) + "px")
                        .style("left", (e.pageX + 10) + "px");

                })
                .on("mouseout", function () {
                    return tooltip
                        .style("visibility", "hidden");
                });

            let dot4 = svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 2)
                .attr("cx", function (d) { return x(d.date); })
                .attr("cy", function (d) { return y(d.throughput19); })
                .style("fill", "#666666")
                .attr("opacity", ".75")
                .on("mouseover", function (d, i) {
                    //console.log(i.value)
                    let num = (Math.round(i.throughput19 * 10) / 10).toLocaleString("en-US")
                    let date = formatDateMonth(i.date)
                    tooltip.text(`${date}: ${num}`);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function (e) {
                    // console.log(e)
                    return tooltip
                        .style("top", (e.pageY - 10) + "px")
                        .style("left", (e.pageX + 10) + "px");

                })
                .on("mouseout", function () {
                    return tooltip
                        .style("visibility", "hidden");
                });


        })