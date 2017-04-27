module.exports = function(RED) {

    var m = require('mraa');
    var servoModule = require("jsupm_servo");
    var fs = require('fs');

    function groveServo(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.angle = parseInt(n.angle);
        if(parseInt(this.platform) == 512) {
            var arr = JSON.parse(fs.readFileSync('/tmp/imraa.lock', 'utf8')).Platform;
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].hasOwnProperty('uart')) {
                    //explicitly add the FIRMATA subplatform for MRAA
                    m.addSubplatform(m.GENERIC_FIRMATA, arr[i].uart);
                    }
                }
        }
        this.servo = new servoModule.ES08A(parseInt(this.pin) + parseInt(this.platform));
        this.status({});

        var node = this;

        node.servo.setAngle(node.angle);//default angle

        this.on('input', function(msg){
            var angle = parseInt(msg.payload);
            angle = (angle < 0 || angle > 180) ? 90 : angle; //set to center if angle is out of bounds
            node.servo.setAngle(angle);//set to angle
        });

        //on exit
        this.on("close", function() {
        });
    }
    RED.nodes.registerType('upm-grove-servo', groveServo);
}
