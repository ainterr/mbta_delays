util = (function() {
    var color = d3.scale.category10();
    
    function random_data(length, variance) {
        var data = [];
        var now = new Date();

        now = now.addDays(-1 * (length - 1));
        for(var i = 0; i < length; i++) {
            var variance = Math.random()*30+1;
            data.push({
                "depart": now.getTime(), 
                "arrive": now.addMinutes(60 + variance).getTime(),
                "transit": now.addHours(1).getTime(),
                "drive": now.addMinutes(30).getTime(),
                "bike": now.addMinutes(45).getTime(),
                //"walk": now.addHours(2).getTime(),
            });
            now = now.addDays(1);
        }

        return data;
    }

    function get_timestring(seconds) {
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var weeks = Math.floor(days / 7);
        var months = Math.floor(weeks / 4);
        var years = Math.floor(months / 12);
    
        seconds %= 60;
        minutes %= 60;
        hours %= 24;
        days %= 7;
        weeks %= 4;
        months %= 12;
    
        var result = []
        if(years > 0) result.push(years+" year"+ (years>1?"s":""));
        if(months > 0) result.push(months+" month"+ (months>1?"s":""));
        if(weeks > 0) result.push(weeks+" week"+ (weeks>1?"s":""));
        if(days > 0) result.push(days+" day"+ (days>1?"s":""));
        if(hours > 0) result.push(hours+" hour"+ (hours>1?"s":""));
        if(minutes > 0) result.push(minutes+" minute"+ (minutes>1?"s":""));
        if(seconds > 0) result.push(seconds+" second"+ (seconds>1?"s":""));
    
        if(result.length === 0) result.push("0 seconds");
    
        return result.join(", ");
    }

    function filter_time(data, time) {
        var now = new Date();
        var values = data.filter(function(d) {
            return now.getTime() - d.depart < time;
        });
        return values;
    }

    function total_time(data, first_attr, second_attr) {
        return data.reduce(function(first, second) {
            return first + (second[first_attr] - second[second_attr]);
        }, 0) / 1000;
    }

    return {
        YEAR: 365*24*60*60*1000,
        MONTH: 30*24*60*60*1000,
        WEEK: 7*24*60*60*1000,
        DAY: 24*60*60*1000,

        color: color,
        get_timestring: get_timestring,
        random_data: random_data,
        filter_time: filter_time,
        total_time: total_time,
    };
})();
