module.exports = function(RED) {

    var m = require('mraa');
    var servoModule = require("jsupm_servo");

    function groveServo(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.angle = parseInt(n.angle);
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
