const margin = {
    top: 40,
    right: 90,
    bottom: 60,
    left: 80
}

const svgHeight = 430,
    svgWidth = 900;

const height = svgHeight - margin.top - margin.bottom,
    width = svgWidth - margin.left - margin.right;

const dopingColor = "red",
    noDopingColor = "green";

svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .style("background", "#eaeaea")

let tooltip = d3
    .select("#graphArea")
    .append('div')
    .attr("id", "tooltip")
    .style("opacity", 0)
// .style("position", "absolute") .style("z-index", "1000");

document.addEventListener("DOMContentLoaded", async () => {
    const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cycli" +
        "st-data.json";
    let data = await fetch(dataUrl);
    let dataset = await data.json();

    dataset.map(el => {
        let [timeMinute, timeSecond] = el.Time.split(":");
        el.modifiedTimeWithDate = new Date(`01/01/1970 00:${timeMinute}:${timeSecond}`);
    })

    let timeExtent = d3.extent(dataset, (d) => d.modifiedTimeWithDate);
    let yAxisScale = d3
        .scaleTime()
        .domain(timeExtent)
        .range([0, height]);

    let timeFormat = d3.timeFormat("%M:%S");
    let yAxis = d3
        .axisLeft()
        .tickFormat(timeFormat)
        .scale(yAxisScale);

    svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    const YearsInData = dataset.map(d => d.Year);
    let dataYearMinimum = d3.min(YearsInData);
    let dataYearMaximum = d3.max(YearsInData);

    let xAxisScale = d3
        .scaleTime()
        .domain([
            dataYearMinimum - 1,
            dataYearMaximum + 2
        ])
        .range([0, width]);

    let yearFormat = d3.format("d");
    let xAxis = d3
        .axisBottom()
        .tickFormat(yearFormat)
        .scale(xAxisScale);

    const xAxisTranslateY = svgHeight - margin.bottom;
    svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${xAxisTranslateY})`)

    // Y axis label
    svg
        .append("text")
        .attr('transform', 'rotate(-90)')
        .attr("font-size", '20px')
        .attr("font-weight", "bolder")
        .text("Time(Minutes)")
        .attr("x", -height + 100)
        .attr("y", 26)
        .attr("font-size", "17")

    // X axis label
    svg
        .append("text")
        .attr("font-size", '20px')
        .attr("font-weight", "bolder")
        .text("Date")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom + 20)

    let ScatterPlot = svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.modifiedTimeWithDate)
        .attr("cx", (d) => xAxisScale(d.Year))
        .attr("cy", (d) => yAxisScale(d.modifiedTimeWithDate))
        .attr("r", "6")
        .attr("fill", (d) => d.Doping ?
            dopingColor :
            noDopingColor)
        .attr("transform", `translate(${margin.left},${margin.top})`)


    ScatterPlot.on("mouseover", (d, i) => {
            tooltip
                .transition()
                .duration(50)
                .style("opacity", "0.8")

            tooltip
                .attr("data-year", d.Year)
                .style("background", "lightblue")
                .style("left", `${xAxisScale(d.Year) + margin.left}px`)
                .style("top", `${yAxisScale(d.modifiedTimeWithDate)}px`);

            tooltip.html(`${d.Name} ${d.Nationality} <br> Year:${d.Year} Time: ${d.Time} <br><br> Allegation: ${d.Doping}`)
        })
        .on("mouseout", (d) => {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        })

    let legend = svg.selectAll(".legend")
        .data([dopingColor, noDopingColor])
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("id", "legend")
        .attr("transform", (d, i) => `translate(${width-100},${(height/2-100) + i*40})`)

    legend.append("rect")
        .attr("height", "30")
        .attr("width", "30")
        .attr("fill", (d) => d)

    legend.append("text")
        .attr("x", "35")
        .attr("y", "20")
        .text((d) => d === dopingColor ? "Riders With Doping Allegations" : "No Doping Allegations")
})