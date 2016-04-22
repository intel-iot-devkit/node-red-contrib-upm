module.exports = function(RED){

    var mraa = require('mraa');
    var curieImu = require('jsupm_curieimu');

    function curieIMU(n){
        RED.nodes.createNode(this,n);

        // Properties
        this.name = n.name;
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
}
