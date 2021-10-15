
export default function StackedAreaChart(container) {
	// initialization

    let xDomain, data;

    let selected = null;

    const margin = {top:20, left:50, right:20, bottom:20};

    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    const gr = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)// the size of clip-path is the same as
        .attr("height", height); // the chart area

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

        

    function filterByDate(range){
            xDomain = range;  // -- (3)
            update(data); // -- (4)
        }

	function update(_data){

        data = _data; // -- (2)

        const keys = selected? [selected] : data.columns.slice(1);

        const stackedData = d3.stack()
            .keys(keys) (data);

        //console.log("stacked data ", stackedData);

		xScale.domain(xDomain ? xDomain: d3.extent(data, d=>d.date));  // -- (5)

        colorScale.domain(keys);

	    yScale.domain([0,d3.max(stackedData, d => d3.max(d, c => c[1]))]);

        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]));

        svg.selectAll("path").remove();
        svg.selectAll("areaAll").remove();
        svg.selectAll("tooltip").text("");
        
        const areas = gr.selectAll(".area")
            .data(stackedData, d => d.key);
        
        areas.enter() // or you could use join()
            .append("path")
            .attr("class", "areaAll")
            .merge(areas)
            .attr("d", area)
            .attr("fill", d => colorScale(d.key))
            .attr("clip-path", "url(#clip)") 
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                console.log('click ', d.key);
                // toggle selected based on d.key
                if (selected === d.key) {
                    selected = null;
                } else {
                    selected = d.key;
                }
                update(data); // simply update the chart again
            });
        
        areas.remove();

        svg.select(".x-axis2")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis.ticks(d3.timeYear));
    
        svg.select(".y-axis2")
            //.attr("transform", `translate(0,0)`)
            .call(yAxis);
	}
	return {
		update,
        filterByDate
	}
};