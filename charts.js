function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = samples.filter(sampleObj => sampleObj.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = desiredSample[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels  
    var sample_values = result.sample_values.slice(0,10).reverse();;

    // 7. Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otu_labels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    xaxis: {title: "Sample Values"},
    yaxis: {title: ""}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);


// Deliverable 2: Bar and Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Portland'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "ID's"},
      hovermode: "closest"
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// Deliverable 3: Gauge Chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;  
    var gaugeArray = metadata.filter(metaObj => metaObj.id === parseInt(sample));
    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResults = gaugeArray[0];
    // 3. Create a variable that holds the washing frequency.
    var washing = gaugeResults.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washing,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Navel Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range : [null,10],tickwidth:1},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
