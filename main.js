
import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data=>{
        console.log('unemployment data ', data);
        data.forEach(function(d) {
            let totalUnem = d["Wholesale and Retail Trade"] + d["Transportation and Utilities"] + d["Self-employed"] + d["Other"] + d["Mining and Extraction"] + d["Manufacturing"] + d["Leisure and hospitality"] + d["Information"] + d["Government"] + d["Finance"] + d["Education and Health"] + d["Construction"] + d["Business services"] + d["Agriculture"];
            d["total"] = totalUnem;
          });
        //const unemploymentData = data;
        console.log('unemployment data now ', data);
        
    console.log('unemp data ', data);
    const areaChart = AreaChart(".area-chart");  
    areaChart.update(data);  
    
    const stackChart = StackedAreaChart(".stacked-area-chart");
    stackChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackChart.filterByDate(range); // coordinating with stackedAreaChart
    })


});
