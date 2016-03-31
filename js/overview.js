overview = (function() {
    var DATA = [];
    var TOTAL = 0;

    var div = {};

    function data(data) {
        var year = util.filter_time(data, util.YEAR);
        var month = util.filter_time(data, util.MONTH);
        var week = util.filter_time(data, util.WEEK);
        var day = util.filter_time(data, util.DAY);

        DATA = [
            { "name": "day", "data": util.total_time(day, "arrive", "transit") },
            { "name": "week", "data": util.total_time(week, "arrive", "transit") },
            { "name": "month", "data": util.total_time(month, "arrive", "transit") },
            { "name": "year", "data": util.total_time(year, "arrive", "transit") },
        ];

        TOTAL = util.total_time(data, "arrive", "depart");
    }

    function start() {
        div.select(".total")
          .transition().duration(1500)
            .tween("text", function() {
                var i = d3.interpolateRound(0, TOTAL);
                return function(t) {
                    this.textContent = util.get_timestring(i(t));
                };
            });

        /*
        div.selectAll("h3")
            .data(DATA).enter()
          .append("h3").html(function(d) {
                return "The MBTA has wasted <span class='bold "+d.name+"'>0 seconds</span> of my life in the last "+d.name+".";
            })
            .each(function(d) {
                d3.select("."+d.name)
                  .transition().duration(3000)
                    .tween("text", function() {
                        var i = d3.interpolateRound(0, d.data);
                        return function(t) {
                            this.textContent = util.get_timestring(i(t));
                        };
                    });
            });
        */
    }

    return {
        init: function(parent) {
            div = d3.select(parent);
        },

        data: data,
        start: start,
    };
})();
