module.exports = function(RED) {

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');

    function groveLED(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.mode = n.mode;
        this.interval = n.interval
        this.sensor = new groveSensor.GroveLed(parseInt(this.pin) + parseInt(this.platform));
        this.status({});

        var node = this;
        var ledState = false;

        if(this.mode == 'blink'){
            this.timer = setInterval(function() {
                ledState ? node.sensor.on() : node.sensor.off();
                node.status({fill: 'green', shape: ledState ? 'dot' : 'ring', text: ledState ? 'ON' : 'OFF'});
                ledState = !ledState;
            }, node.interval);
        } else {
            this.on('input', function(msg){
                var ledState = parseInt(msg.payload) == 1;
                ledState ? node.sensor.on() : node.sensor.off();
                node.status({fill: 'green', shape: ledState ? 'dot' : 'ring', text: ledState ? 'ON' : 'OFF'});
            }); 
        }

        //clear interval on exit
        this.on("close", function() {
            clearInterval(this.timer);
            node.sensor.off();
        });
    }
    RED.nodes.registerType('upm-grove-led', groveLED);
}
