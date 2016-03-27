Date.prototype.addDays = function(d) {    
    return new Date(this.getTime() + (d*24*60*60*1000)); 
}
Date.prototype.addHours = function(h) {    
    return new Date(this.getTime() + (h*60*60*1000)); 
}
Date.prototype.addMinutes = function(m) {
    return new Date(this.getTime() + (m*60*1000)); 
}
Date.prototype.addSeconds = function(s) {
    return new Date(this.getTime() + (s*1000)); 
}
