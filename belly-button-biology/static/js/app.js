function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // d3.json("/metadata/")
    var url = `/metadata/${sample}`;

    d3.json(url).then(function (response) {

        console.log(url);
        console.log(response);

        // Use d3 to select the panel with id of `#sample-metadata`
        // Use `.html("") to clear any existing metadata
        var metadata = d3.select("#sample-metadata").html("");;

        var table = d3.select("#sample-metadata").append("table");
        var tbody = table.append("tbody");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        var resList = d3.entries(response);
        console.log(resList);
        resList.forEach((data) => {
            var row = tbody.append("tr");
            Object.entries(data).forEach(([key, value]) => {
                var cell = tbody.append("td");
                cell.text(value);
            });
        });

        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;

    d3.json(url).then(function (response) {

        console.log(url);
        console.log(response);

        // @TODO: Build a Bubble Chart using the sample data
        var oIds = response.otu_ids;
        var sValues = response.sample_values;
        var oLabels = response.otu_labels;

        var trace1 = {
            type: "bubble",
            x: oIds,
            y: sValues,
            text: oLabels,
            mode: "markers",
            marker: {
                size: sValues,
                color: oIds
            }
        };

        var data = [trace1];

        var layout1 = {
            title: `Sample ${sample}`,
        };

        Plotly.newPlot("bubble", data, layout1);

        // Gnome Sort to clean arrays for next section, if needed
        var i = 0;
        while (i < sValues.length) {
            if (i == 0 || sValues[i] >= sValues[i - 1]) {
                i++;
            } else {
                var temp = sValues[i];
                sValues[i] = sValues[i - 1];
                sValues[i - 1] = temp;

                temp = oIds[i];
                oIds[i] = oIds[i - 1];
                oIds[i - 1] = temp;

                temp = oLabels[i];
                oLabels[i] = oLabels[i - 1];
                oLabels[i - 1] = temp;

                i--;
            }
        };

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        var trace2 = {
            type: "pie",
            values: sValues.slice(sValues.length - 10, sValues.length),
            labels: oIds.slice(oIds.length - 10, oIds.length),
            hoverinfo: oLabels.slice(oLabels.length - 10, oLabels.length)
        };

        // console.log(sValues);
        // console.log(oIds);
        // console.log(oLabels);

        var data = [trace2];

        var layout2 = {
        };

        Plotly.newPlot("pie", data, layout2);

    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
