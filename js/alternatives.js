alternatives = (function() {
    var DATA = [];
    var ALT = [
        { 
            "description": "Earning Minimum Wage",
            "glyphicon": "usd",
            "verb": "I could have made",
            "fn": function(s) { return "$"+(10*s/60/60).toFixed(2); },
            "assumption": "$10.00 minimum wage in Massachusetts"
        },
        { 
            "description": "Doing Moderate Cardio",
            "glyphicon": "heart",
            "verb": "I could have burned",
            "fn": function(s) { return (800*s/60/60).toFixed(0)+" calories"; },
            "assumption": "800 calories per hour"
        },
        { 
            "description": "Sleeping",
            "glyphicon": "bed",
            "verb": "I could have gotten",
            "fn": function(s) { return (s/60/60/8).toFixed(2)+" nights sleep"; },
            "assumption": "8 hours of sleep per night"
        },
        { 
            "description": "Travel",
            "glyphicon": "road",
            "verb": "I could have traveled",
            "fn": function(s) { return (60*s/60/60).toFixed(2)+" miles"; },
            "assumption": "traveling by car at 60 mph"
        },
        { 
            "description": "Reading",
            "glyphicon": "book",
            "verb": "I could have read",
            "fn": function(s) { return (s/60/240).toFixed(2)+" books"; },
            "assumption": "1 page per minute and 240 pages per book"
        },
        { 
            "description": "Studying",
            "glyphicon": "education",
            "verb": "I could have completed",
            "fn": function(s) { return (s/60/60/64).toFixed(2)+" courses"; },
            "assumption": "4 credit-hour classes and 16 week semesters"
        },
    ];

    var div = {};

    function data(data) {
        DATA = [
            { "name": "day", "value": util.total_time(util.filter_time(data, util.DAY), "arrive", "transit") },
            { "name": "week", "value": util.total_time(util.filter_time(data, util.WEEK), "arrive", "transit") },
            { "name": "month", "value": util.total_time(util.filter_time(data, util.MONTH), "arrive", "transit") },
            { "name": "year", "value": util.total_time(util.filter_time(data, util.YEAR), "arrive", "transit") },
        ];
    }
    
    function start() {
        var panels = div.selectAll("div")
          .data(ALT).enter()
          .append("div")
            .attr("class", "col-md-6")
          .append("div")
            .attr("class", "panel panel-default")
          .append("div")
            .attr("class", "panel-body text-center");
        panels.append("h1").append("p")
            .attr("class", "text-center")
          .append("span");
        panels.append("h3")
            .attr("class", "text-center")
            .text("Earning Minimum Wage");
        panels.append("div")
            .attr("class", "content");

        panels.select("span")
            .attr("class", function(d) { return "glyphicon glyphicon-"+d.glyphicon; });
        panels.select("h3")
            .text(function(d) { return d.description; });
        panels.select(".content")
          .selectAll("h4")
            .data(function(d) {
                return DATA.map(function(e) {
                    var ret = JSON.parse(JSON.stringify(e));
                    ret.panel = d;
                    return ret;
                });
            })
          .enter().append("h4")
            .html(function(d) {
                return "In the last <span class='bold'>"+d.name+"</span> "+d.panel.verb+" <span class='bold'>"+d.panel.fn(d.value)+"</span>";
            });
        panels
            .append("h4").append("small").text(function(d) {
                return "Assuming "+d.assumption+".";
            });
    }

    return {
        init: function(parent) {
            div = d3.select(parent);
        },
        data: data,
        start: start,
    };
})();
