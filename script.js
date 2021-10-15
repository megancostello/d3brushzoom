
d3.csv('unemployment.csv', d3.autoType).then(data=>{
        console.log('unemployment data ', data);
        data.forEach(function(d) {
            totalUnem = d["Wholesale and Retail Trade"] + d["Transportation and Utilities"] + d["Self-employed"] + d["Other"] + d["Mining and Extraction"] + d["Manufacturing"] + d["Leisure and hospitality"] + d["Information"] + d["Government"] + d["Finance"] + d["Education and Health"] + d["Construction"] + d["Business services"] + d["Agriculture"];
            d["total"] = totalUnem;
          });
        //const unemploymentData = data;
        console.log('unemployment data now ', data);
        


// input: selector for a chart container e.g., ".chart"
function AreaChart(container){

	// initialization
    const margin = {top:20, left:50, right:20, bottom:20};

    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    const gr = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleTime()
        .rangeRound([0,width]);

    const yScale = d3.scaleLinear()
        .range([height,0]);

    gr.append('path')
        .attr('class', 'pathy');

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    let xAxGr = gr.append("g")
        .attr("class", "axis x-axis");

    let yAxGr = gr.append("g")
        .attr("class", "axis y-axis");

    


	function update(data){ 

		// update scales, encodings, axes (use the total count)
        //xScale.domain(data.columns.map(d=>d.date.getFullYear()));
        xScale.domain(d3.extent(data,(d)=>d.date));

	    yScale.domain([0, d3.max(data, d=>d.total)]);

        let area = d3.area()
            .x((d)=> xScale(d.date))
            .y1((d) => yScale(d.total))
            .y0(() => yScale.range()[0]);

        //console.log('area ', area);

        svg.select(".pathy")
            .datum(data)
            .attr("d", area)
            .attr("fill", "steelblue");

        svg.select(".x-axis")
            // .transition()
            // .duration(1500)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.ticks(d3.timeYear));
    
        svg.select(".y-axis")
            // .transition()
            // .duration(1500)
            .attr("transform", `translate(0,0)`)
            .call(yAxis);
	}

	return {
		update // ES6 shorthand for "update": update
	};
};

function StackedAreaChart(container) {
	// initialization
    const margin = {top:20, left:50, right:20, bottom:20};

    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    const gr = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleTime()
        .rangeRound([0,width]);

    const yScale = d3.scaleLinear()
        .range([height,0]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    const xAxGr = gr.append("g")
        .attr("class", "axis x-axis2");

    const yAxGr = gr.append("g")
        .attr("class", "axis y-axis2");

    gr.append("path")
        .attr("class", "pathy2");
    
    const tooltip = svg
        .append("text")
        .attr("class", "tooltip")
        .attr("x", 55)
        .attr("y", 25);

	function update(data){
        const stackedData = d3.stack()
            .keys(data.columns.slice(1))
            (data);

        console.log("stacked data ", stackedData);

        colorScale.domain(stackedData.map(d => d.key));

        xScale.domain(d3.extent(data, d=>d.date));

	    yScale.domain([0,d3.max(stackedData, d => d3.max(d, c => c[1]))]);

        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));
        
        const areas = gr.selectAll(".area")
            .data(stackedData, d => d.key);
        
        areas.enter() // or you could use join()
            .append("path")
            .attr("class", "areaAll")
            .merge(areas)
            .attr("d", area)
            .attr("fill", d => colorScale(d.key))
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""));
        
        areas.exit().remove();

        svg.select(".x-axis2")
            // .transition()
            // .duration(1500)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.ticks(d3.timeYear));
    
        svg.select(".y-axis2")
            // .transition()
            // .duration(1500)
            //.attr("transform", `translate(0,0)`)
            .call(yAxis);
	}
	return {
		update
	}
};


    console.log('unemp data ', data);
    const areaChart1 = AreaChart(".area-chart");  
    areaChart1.update(data);  
    
    const areaChart2 = StackedAreaChart(".stacked-area-chart");
    areaChart2.update(data);


});
