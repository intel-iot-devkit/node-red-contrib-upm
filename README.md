## node-red-node-upm

<a href="http://nodered.org" target="_new">Node-RED</a> nodes to talk to <a href="https://software.intel.com/en-us/iot/hardware/sensors" target="_blank">sensors</a> supported by the <a href="https://github.com/intel-iot-devkit/upm" target="_blank">UPM</a> library

### Install

Run the following command in the root directory of your Node-RED install, usually
this is ~/.node-red .

        npm install node-red-node-upm

### Usage

Only tested on the Intel Edison so far, but it should work on other platforms supported by <a href="https://github.com/intel-iot-devkit/mraa" target="_blank">MRAA</a> and <a href="https://github.com/intel-iot-devkit/upm" target="_blank">UPM</a>.

Ensure you have the latest firmware running, and have Node-RED installed.

See the [Intel Downloads](https://software.intel.com/en-us/iot/home) for
hardware / downloads for your particular board.

If you do need to install Node-RED, you can do this as follows from the home directory of the root user

        npm install -g --unsafe-perm node-red
        mkdir .node-red
        cd .node-red
        npm install node-red-node-upm

Then run

    node-red

### Supported Sensors

* Grove Starter Kit
    * Grove Push Button
    * Grove Touch Button
    * Grove Relay
    * Grove Light Sensor
    * Grove LED
    * Grove RGB LCD
    * Grove Rotary Angle Sensor
    * Grove Sound Sensor
    * Grove Temperature Sensor
* Arduino 101
    * Built in Curie IMU
* ... more to follow

### Screenshot
![screenshot](https://raw.githubusercontent.com/w4ilun/Node-Red-Node-UPM/master/screenshot.png)
