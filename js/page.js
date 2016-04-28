//var data = util.random_data(100);

d3.json("http://50.169.192.125:8888/data", function(error, json) {
    if (error) {
        console.warn("No data available");
        data = util.random_data(100, 20);

        $(".error-message").modal();
    }
    else {
        data = json.results.map(function(d) {
            delete d['walking'];
            return d;
        });
    }

    if(data[data.length-1].arrive === "") {
        data.splice(data.length-1, 1);
    }

    overview.init(".overview");
    overview.data(data);
    overview.start();
    
    delays.init(".delays");
    delays.data(data);
    delays.start();

    area.init(".area");
    area.data(data);
    area.start();
    
    alternatives.init(".alternatives");
    alternatives.data(data);
    alternatives.start();
});
