const margin = {
    top: 40,
    right: 20,
    bottom: 60,
    left: 80
}

const svgHeight = 500,
    svgWidth = 900;

const height = svgHeight - margin.top - margin.bottom,
    width = svgWidth - margin.left - margin.right;

svg = d3
    .select("#graphArea")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .style("background", "#eaeaea")

document.addEventListener("DOMContentLoaded", async () => {
    const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cycli" +
        "st-data.json";
    let data = await fetch(dataUrl);
    let dataset = await data.json();
    // console.log(dataset);

    dataset.map(el => {
        timeMinutesSecondsArray = el
            .Time
            .split(":");
        timeMinute = timeMinutesSecondsArray[0];
        timeSecond = timeMinutesSecondsArray[1];
        dateTime = new Date(`01/01/1970 00:${timeMinute}:${timeSecond}`)
        el.modifiedTime = dateTime;
    })

    let timeExtent = d3.extent(dataset, (d) => d.modifiedTime);
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
        .domain([dataYearMinimum - 1, dataYearMaximum + 2])
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

    let ScatterPlot = svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d) => xAxisScale(d.Year))
        .attr("cy", (d) => yAxisScale(d.modifiedTime))
        .attr("r", "5")
        .attr("fill", (d) => d.Doping ? "red" : "green")
        .attr("transform", `translate(${margin.left},${margin.top})`)

})