module.exports = function(RED){

    var mraa = require('mraa');
    var firmata = require('arduino-firmata');
    var curieImu = require('jsupm_curieimu');

    function ArduinoDevice(n) {
        RED.nodes.createNode(this,n);
        this.device = n.device || null;

        var node = this;

        firmata.list(function (err, devices) {
            if (devices.length == 0) {
                node.warn(RED._("No devices found!"));
            } else if (!node.device) {
		node.log(RED._("No device specified. Connecting to first device found __device__", {device:devices[0]}));
		mraa.addSubplatform(mraa.GENERIC_FIRMATA, devices[0]);
	    } else {
                if (devices.indexOf(node.device) === -1) {
                    node.warn(RED._("Device __device__ not found.", {device:node.device}));
                    mraa.addSubplatform(mraa.GENERIC_FIRMATA, devices[0]);
                }
                else {
                    node.log(RED._("Connecting to __device__", {device:node.device}));
                    mraa.addSubplatform(mraa.GENERIC_FIRMATA, node.device);
                }
            }
        });
    }
    RED.nodes.registerType("arduino-device",ArduinoDevice);

    function curieIMU(n){
        RED.nodes.createNode(this,n);

        // Properties
        this.name = n.name;
	this.device = n.device;
	this.mode = n.mode;
        this.interval = n.interval
	this.imu = new curieImu.CurieImu();
        this.status({});

        var node = this;
	
	var msg = { topic:node.name + '/' + node.mode };
        var msgx = { topic:node.name + '/' + node.mode + 'X' };
	var msgy = { topic:node.name + '/' + node.mode + 'Y' };
	var msgz = { topic:node.name + '/' + node.mode + 'Z' };

        this.timer = setInterval(function() {
	    if(node.mode == 'ACCEL') {
	        node.imu.updateAccel();
                msgx.payload = node.imu.getAccelX();
	        msgy.payload = node.imu.getAccelY();
	        msgz.payload = node.imu.getAccelZ();
	    } else {
		node.imu.updateGyro();
                msgx.payload = node.imu.getGyroX();
	        msgy.payload = node.imu.getGyroY();
	        msgz.payload = node.imu.getGyroZ();
	    }

	    msg.payload = [ msgx, msgy, msgz ];
            node.send(msg);
        }, node.interval);

        // Clear interval on exit
        this.on('close', function(){
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('upm-curieimu', curieIMU);

    RED.httpAdmin.get("/arduinodevices", RED.auth.needsPermission("arduino.read"), function(req,res) {
        firmata.list(function (err, devices) {
            res.json(devices);
        });
    });
}
