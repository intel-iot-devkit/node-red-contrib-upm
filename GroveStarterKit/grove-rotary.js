module.exports = function(RED){

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');

    function groveRotary(n){
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.unit = n.unit;
        this.interval = n.interval
        this.sensor = new groveSensor.GroveRotary(parseInt(this.pin) + parseInt(this.platform));
        this.status({});
        
        var node = this;

        var msg = { topic:node.name + '/A' + node.pin };

        //poll reading at interval
        this.timer = setInterval(function() {
            if(node.unit == 'ABSRAW') {
                msg.payload = node.sensor.abs_value();
            }
            if(node.unit == "ABSDEG") {
                msg.payload = node.sensor.abs_deg();
            }
            if(node.unit == "ABSRAD") {
                msg.payload = node.sensor.abs_rad();
            }
            if(node.unit == 'RELRAW') {
                msg.payload = node.sensor.rel_value();
            }
            if(node.unit == "RELDEG") {
                msg.payload = node.sensor.rel_deg();
            }
            if(node.unit == "RELRAD") {
                msg.payload = node.sensor.rel_rad();
            }
            node.send(msg);
        }, node.interval);

        //clear interval on exit
        this.on('close', function() {
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('upm-grove-rotary', groveRotary);
}
