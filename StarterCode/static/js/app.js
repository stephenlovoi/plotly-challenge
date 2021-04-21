var sampleJson = "samples.json";

var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");


function init() {
    var sampleJson = "samples.json";
    var idSelect = d3.select("#selDataset");
    d3.json(sampleJson).then((data) => {
        var sampleName = data.names;
        sampleName.forEach((name) => {
            idSelect
                .append("option")
                .text(name)
                .property("value", name);
        }); //close forEach
        var firstSample = sampleName[0];
        buildTable(firstSample); 
        buildPlot(firstSample);
    });
}

function optionChanged(newSample) {
    buildTable(newSample);
    buildPlot(newSample);
}

function buildTable(id) {

    d3.json(sampleJson).then((data) => {
        var metaData = data.metadata.filter(participant => participant.id == id)[0];
        var demoData = d3.select("#sample-metadata");
        demoData.html("");

        Object.entries(metaData).forEach(([key, value]) => {
            var demoList = demoData
                .append("h6")
                .text(`${key.toUpperCase()}: ${value}`)
        });
        
    });
}        


function buildPlot(sampleName) {
    var sampleJson = "samples.json";
    d3.json(sampleJson).then(data => {
        var samples = data.samples.filter(participant => participant.id == sampleName)[0];
        var otu_ids = samples.otu_ids;
        var otu_labels = samples.otu_labels;
        var sample_values = samples.sample_values;

        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };
        var bubbleData = [bubbleTrace];

        var bubbleLayout = {
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value"}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var barTrace = {
            type: "bar",
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).reverse().map(x => `OTU ID ${x}`),
            orientation: "h"
        };

        var barData = [barTrace];

        var barLayout = {
            xaxis: {title: "Sample Value"},
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

init();