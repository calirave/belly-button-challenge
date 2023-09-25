//fetch the JSON data and console log it

//Use d3 to readin samples.json
const url =   "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init(){
  
  //populate the dropdown selector
  let dropdownSelector = d3.select("#selDataset");
    
  //load the names object to get subjectIDs
  
  d3.json(url).then(function (data) {
    let mynames = data.names;
    mynames.forEach((subject) => {
      dropdownSelector.append("option").text(subject).property("value", subject);
    });

  //call the chart function
    let firstid = mynames[0];
    barchart(firstid);
    bubblechart(firstid);
    demographic(firstid);
  });
}//close function

//build the bubble chart
function bubblechart(id) {
  
  //populate the samples
  d3.json(url).then(function (data){
    let mysample = data.samples;
    
    //filter the samples only for that subject
    let myfilteredsample = mysample.filter(myfilter => myfilter.id == id);
    
    //get the first record from the array
    let mydata = myfilteredsample[0];
    

    //obtain the sample values, otu ids, and otu labels and cast them to an array each
    let otuid = mydata.otu_ids;
    let labels = mydata.otu_labels;
    let samplevals = mydata.sample_values;
    
  
    //splice the data to get first 10
    let xtick = otuid;
    let toplabel = labels;
    let ytick = samplevals;
    
    
    //build the trace 
    let mytrace = {
      x: xtick,
      y: ytick,
      text: toplabel,
      mode: "markers",
      marker: {
        size: samplevals,
        color: otuid,
      }
    }//close trace


    //plot the graph
    Plotly.newPlot("bubble", [mytrace])
    
  })//close d3 call
}//close function

//build the barchart
function barchart(id) {
  
  //populate the samples
  d3.json(url).then(function (data){
    let mysample = data.samples;
    console.log(mysample);
    
    //filter the samples only for that subject
    let myfilteredsample = mysample.filter(myfilter => myfilter.id == id);
    
    //get the first record from the array
    let mydata = myfilteredsample[0];
    

    //obtain the sample values, otu ids, and otu labels and cast them to an array each
    let otuid = mydata.otu_ids;
    let labels = mydata.otu_labels;
    let samplevals = mydata.sample_values;
    console.log(otuid, labels, samplevals);
  
    //splice the data to get first 10
    let ytick = otuid.slice(0,10).map(id => `OTU ${id}`).reverse();
    let toplabel = labels.slice(0,10).reverse();
    let xtick = samplevals.slice(0,10).reverse();
    
    
    //build the trace 
    let mytrace = {
      x: xtick,
      y: ytick,
      text: toplabel,
      type: "bar",
      orientation: "h"
    }//close trace

    //build the layout
    let layout = {
      title: "Top 10 OTUs"
    }//close layout

    //plot the graph
    Plotly.newPlot("bar", [mytrace], layout)
    
  })//close d3 call
}//close function

//build the demographic panel
function demographic(id) {
  
  //populate the samples
  d3.json(url).then(function (data){
    let mysample = data.metadata;
    console.log(mysample);
    
    //filter the samples only for that subject
    let myfilteredsample = mysample.filter(myfilter => myfilter.id == id);

    //get the first record from the array
    let mydata = myfilteredsample[0];

    //clear the demographic panel
    d3.select("#sample-metadata").html("");
    
    //d3.select("#sample-metadata").html("")
    Object.entries(mydata).forEach(([key, value]) => {
     d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    })//close object entries
  })//close d3 call
}//close function

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
  let dropdown = d3.select("#selDataset");
  let choice = dropdown.property("value");
    barchart(choice);
    bubblechart(choice);
    demographic(choice);
  
};

init()
