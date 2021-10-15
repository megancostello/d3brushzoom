// input: selector for a chart container e.g., ".chart"
export default function AreaChart(container){

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

    console.log('brush dimensions 1 ', width - margin.right);

    const brush = d3.brushX()
        .extent([[margin.left, margin.top], [width + margin.left, height + margin.bottom]])
        .on("brush", brushed)
        .on("end", brushEnded); //brush ended event

    svg.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
      }

    function brushEnded (event) {
        if (!event.selection) {
            return;
        }
        const interval = d3.timeYear;
        const [x0,x1] = event.selection.map(d => interval.round(xScale.invert(d)));
        d3.select(this).transition().call(brush.move, [x0,x1].map(xScale));
    }

    const listeners = { brushed: null };

    function on(event, listener) {
        listeners[event] = listener;
  }

	function update(data){ 

		// update scales, encodings, axes (use the total count)
        //xScale.domain(data.columns.map(d=>d.date.getFullYear()));
        xScale.domain(d3.extent(data, d=>d.date));

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
		update, on // ES6 shorthand for "update": update
	};
};