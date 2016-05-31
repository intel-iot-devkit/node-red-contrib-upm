module.exports = function(RED){

    var mraa = require('mraa');
    var curieImu = require('jsupm_curieimu');

    function curieIMU(n){
        RED.nodes.createNode(this,n);

        // Checks
        if (n.accel === undefined) { n.accel = true; }
        if (n.gyro === undefined) { n.gyro = true; }

        // Properties
        this.name = n.name;
        this.accel = n.accel;
        this.gyro = n.gyro;
        this.interval = n.interval
        this.imu = new curieImu.CurieImu();
        this.status({});

        var node = this;

        this.timer = setInterval(function() {
            if(node.accel) {
                node.imu.updateAccel();

                // Set values
                var vals = {};
                vals["accelX"] = node.imu.getAccelX();
                vals["accelY"] = node.imu.getAccelY();
                vals["accelZ"] = node.imu.getAccelZ();

                var msg = { topic:node.name + '/' + 'ACCEL' };
                msg.payload = vals;
                node.send(msg);
            }

            if(node.gyro) {
                node.imu.updateGyro();

                // Set values
                var vals = {};
                vals["gyroX"] = node.imu.getGyroX();
                vals["gyroY"] = node.imu.getGyroY();
                vals["gyroZ"] = node.imu.getGyroZ();

                var msg = { topic:node.name + '/' + 'GYRO' };
                msg.payload = vals;
                node.send(msg);
            }

        }, node.interval);

        // Clear interval on exit
        this.on('close', function(){
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('upm-curieimu', curieIMU);
}
