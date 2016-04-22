module.exports = function(RED){

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');

    function groveLight(n){
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.unit = n.unit;
        this.interval = n.interval
        this.sensor = new groveSensor.GroveLight(parseInt(this.pin) + parseInt(this.platform));
        this.status({});
        
        var node = this;

        var msg = { topic:node.name + '/A' + node.pin };

        //poll reading at interval
        this.timer = setInterval(function() {
            if(node.unit == 'RAW') {
                msg.payload = node.sensor.raw_value();
            } else {
                msg.payload = node.sensor.value(); //Lux
            }
            node.send(msg);
        }, node.interval);

        //clear interval on exit
        this.on("close", function() {
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType("upm-grove-light", groveLight);
}
