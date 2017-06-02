module.exports = function(RED) {

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');
    var fs = require('fs');

    function groveLED(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.mode = n.mode;
        this.interval = n.interval;
        if(parseInt(this.platform) == 512) {
	    var file;
	    try {
	        file = fs.readFileSync('/tmp/imraa.lock', 'utf8');
		var arr = JSON.parse(file).Platform;
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].hasOwnProperty('uart')) {
                        //explicitly add the FIRMATA subplatform for MRAA
                        m.addSubplatform(m.GENERIC_FIRMATA, arr[i].uart);
                    }
                }
	    } catch (e) {
		if (e.code === 'ENOENT') {
                    //if we cannot find lock file we assume ttyACM0 and try
                    m.addSubplatform(m.GENERIC_FIRMATA, "/dev/ttyACM0");
		}
	    }
        }
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
