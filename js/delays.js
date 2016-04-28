delays = (function() {
    var margin = {top: 20, right: 20, bottom: 30, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category10();
    
    var DATA = [];
    var DOMAIN = "depart";
    var KEYS = [];

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var div = {};
    var svg = {};

    // TODO there's a better way to do this...
    function sum_to(d, key) {
        var sum = 0, total;
        DATA.forEach(function(e) {
            sum += (e[key] - e[DOMAIN])/60/1000;
            if(e === d) total = sum;
        });
        
        return total; 
    }

    function data(data) {
        DATA = data;

        if(DATA.length > 0) {
            KEYS = Object.keys(DATA[0]).filter(function(k) {
                return k !== DOMAIN;
            })
            .sort(function(a, b) {
                if(sum_to(DATA[DATA.length-1], a) > sum_to(DATA[DATA.length-1], b))
                    return -1;
                if(sum_to(DATA[DATA.length-1], a) < sum_to(DATA[DATA.length-1], b))
                    return 1;
                return 0;
            });
        }
        else KEYS = [];
    }
    
    function start() {
        x.domain(d3.extent(DATA, function(d) { return d[DOMAIN]; }));
        y.domain([0,
            d3.max(DATA, function(d) {
                return d3.max(KEYS, function(k) {
                    return (d[k] - d[DOMAIN])/60/1000;
                });
            })
        ]);
        
        var dummy_line = d3.svg.line()
            .x(function(d) { return x(d[DOMAIN]); })
            .y(height/2);

        var lines = KEYS.map(function(k) {
            return d3.svg.line()
                .x(function(d) { return x(d[DOMAIN]); })
                .y(function(d) { return y((d[k] - d[DOMAIN])/60/1000); });
        });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time (minutes)");

        lines.forEach(function(l, i) {
            var line = svg.append("path")
                .datum(DATA)
                .attr("class", "line")
                .style("stroke", color(i))
                .style("stroke-width", "2px")
                .style("fill", "rgba(0,0,0,0)")
                .attr("data-legend", util.verbose_name[KEYS[i]])
                .attr("data-legend-color", color(i))
                .attr("d", dummy_line);
            line.transition().duration(1500)
                .attr("d", l);
        });

        svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(50,30)")
            .style("font-size","12px")
            .call(d3.legend);
    }

    return {
        init: function(parent) {
            div = d3.select(parent);
            svg = div.append("svg")
                .attr("viewBox", "0 0 "+(width+margin.left+margin.right)+" "+(height+margin.top+margin.bottom))
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        },
        data: data,
        start: start,
    };
})();
