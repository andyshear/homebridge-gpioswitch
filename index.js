var Gpio = require('onoff').Gpio
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-gpioswitch', 'GPIOSWITCH', GPIOAccessory);
}

function GPIOAccessory(log, config) {
    this.log = log;
    this.name = config['name'];
    this.pin = config['pin'];
    this.service = new Service.Switch(this.name);

    if (!this.pin) throw new Error('You must provide a config value for pin.');

    this.state = false;


    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));

}

GPIOAccessory.prototype.getServices = function() {
    return [this.service];
}

GPIOAccessory.prototype.getOn = function(callback) {
    callback(null, this.state);
}

GPIOAccessory.prototype.setOn = function(on, callback) {
    this.state = !on;
    var relay = new Gpio(this.pin, 'out');
    if(on)
      relay.writeSync(on);
    else
      relay.unexport();
    this.log('writing ' + (on ? 'true' : 'false') + 'to gpio: ' + this.pin)
		callback(null);
}
