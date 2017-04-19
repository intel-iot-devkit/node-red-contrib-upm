module.exports = function(RED) {

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');

    function groveButton(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
	this.platform = n.platform;
        this.pin = n.pin;
        this.mode = n.mode;
        this.interval = n.interval
        if(parseInt(this.platform) == 512) {
            //explicitly add the FIRMATA subplatform for MRAA
            m.addSubplatform(m.GENERIC_FIRMATA, "/dev/ttyACM0");
        }
        this.sensor = new groveSensor.GroveButton(parseInt(this.pin) + parseInt(this.platform));
        this.board = m.getPlatformName();
        this.status({});

        var node = this;

	var msg = { topic:node.name + '/D' + node.pin };

        this.timer = setInterval(function(){
            msg.payload = node.sensor.value();
            node.send(msg);
	}, node.interval); 
        

        //clear interval on exit
        this.on("close", function(){
            clearInterval(this.timer);
        });
    }
    RED.nodes.registerType('UPM-Grove-Button', groveButton);
}
