module.exports = function(RED){

    var m = require('mraa');
    var groveSensor = require('jsupm_grove');
    var fs = require('fs');

    function groveLight(n){
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.pin = n.pin;
        this.unit = n.unit;
        this.interval = n.interval;
        if(parseInt(this.platform) == 512) {
            var arr = JSON.parse(fs.readFileSync('/tmp/imraa.lock', 'utf8')).Platform;
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].hasOwnProperty('uart')) {
                    //explicitly add the FIRMATA subplatform for MRAA
                    m.addSubplatform(m.GENERIC_FIRMATA, arr[i].uart);
                    }
                }
        }
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
