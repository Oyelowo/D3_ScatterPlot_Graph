document.addEventListener("DOMContentLoaded",
    async () => {
        const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
        let data = await fetch(dataUrl);
        let dataset = await data.json();
        // console.log(dataset);

        const margin = {
            top: 40,
            right: 20,
            bottom: 60,
            left: 80
        }

        const svgHeight = 500,
            svgWidth = 900;

        const height = svgHeight - margin.top - margin.bottom,
            width = svgWidth - margin.el - margin.right;

        svg = d3.select("#graphArea")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .style("background", "#eaeaea")

        let modifiedTime = dataset.map(el => {
            timeMinutesSecondsArray = el.Time.split(":");
            timeMinute = timeMinutesSecondsArray[0];
            timeSecond = timeMinutesSecondsArray[1];
            dateTime = new Date(`01/01/1970 00:${timeMinute}:${timeSecond}`)
            return dateTime;
        })

        let timeExtent = d3.extent(modifiedTime, (d) => d);
        let yAxisScale = d3.scaleTime()
            .domain(timeExtent).range([0, height]);

            
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

    }




)