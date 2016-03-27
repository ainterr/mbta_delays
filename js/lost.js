lost = (function() {
    var DATA = [];

    var div = {};

    function data(data) {
        DATA = data;
    }

    function start() {
    }

    return {
        init: function(parent) {
            div = d3.select(parent);
        },
        
        data: data,
        start: start
    };
})();
