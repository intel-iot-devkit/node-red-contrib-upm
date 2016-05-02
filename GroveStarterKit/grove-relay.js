module.exports = function(RED) {

    var m = require('mraa');
    var upmRelay = require('jsupm_grove');

    function groveRelay(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
	this.platform = n.platform;
        this.pin = n.pin;
        this.interval = n.interval;
        this.relay = new upmRelay.GroveRelay(parseInt(this.pin) + parseInt(this.platform));
        this.board = m.getPlatformName();
        this.status({});

        var node = this;

        this.timer = setInterval(function(){
		
	});

	this.on('input', function(msg){
	    if (msg.payload == "1"){
                node.relay.on();
	    }
	    else if (msg.payload == "0"){
                node.relay.off();   
	    }	    
	});

        //clear interval on exit
        this.on("close", function(){
            clearInterval(this.timer);
            //node.buzzer.off();
        });
    }
    RED.nodes.registerType('UPM-Grove-Relay', groveRelay);
}
