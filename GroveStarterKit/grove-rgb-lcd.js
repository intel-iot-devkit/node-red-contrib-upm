module.exports = function(RED) {

    var m = require('mraa');
    var LCD = require('jsupm_i2clcd');

    function groveRGBLCD(n) {
        //init
        RED.nodes.createNode(this,n);

        //properties
        this.name = n.name;
        this.platform = n.platform;
        this.r = parseInt(n.r);
        this.g = parseInt(n.g);
        this.b = parseInt(n.b);
        this.row = parseInt(n.row);
        this.column = parseInt(n.column);
        this.sensor = new LCD.Jhd1313m1 (parseInt(node.platform), 0x3E, 0x62);
        this.board = m.getPlatformName();
        this.status({});

        var node = this;

        this.on('input', function(msg) {
            node.sensor.setCursor(node.row, node.column);
            node.sensor.setColor(node.r, node.g, node.b);
            node.sensor.write(''+msg.payload);
        }); 

        //clear interval on exit
        this.on('close', function() {
            node.sensor.write(''); 
        });
    }
    RED.nodes.registerType('upm-grove-rgb-lcd', groveRGBLCD);
}
