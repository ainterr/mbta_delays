//var data = util.random_data(100);

d3.json("http://50.169.192.125:8888/data", function(error, json) {
    if (error) return console.warn(error);

    data = json.results;

    if(data.length === 0) {
        return console.warn("No data available");
    }

    if(data[data.length-1].arrive === "") {
        data.splice(data.length-1, 1);
    }

    console.log(data);

    overview.init(".overview");
    overview.data(data);
    overview.start();
    
    area.init(".area");
    area.data(data);
    area.start();
    
    lost.init(".lost");
    lost.data(data);
    lost.start();
    
    alternatives.init(".alternatives");
    alternatives.data(data);
    alternatives.start();
});
