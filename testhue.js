
//libmapper/n-bind
var nbind = require('nbind');
var lib = nbind.init(__dirname).lib;

//hue-api
var hue = require("node-hue-api"),
HueApi = hue.HueApi,
lightState = hue.lightState;
var host = "192.168.100.230",
username = "b225912329de4371bdc4d2e18678263",
api = new HueApi(host, username),
state = lightState.create();
hueGrp = 7; //dining room group

//module.exports = binding.lib;

net = new lib.Network();
console.log('interface: '+net.interface);

dev = new lib.Device('hue');
insig = dev.add_input_signal('bri', 1, 'i',
                             function(sig, value) {
                                 state.brightness(value);
                                 api.setGroupLightState(hueGrp, state);
                                 //console.log('js update handler');
                                 console.log('mapper sig \''+sig.name+'\' = '+value);
                             });

//test out
outsig = dev.add_output_signal('out', 1, 'i');

process.on("SIGINT", function () {
    //need to call dev.free() as mapper device deconstructor doesn't get called otherwise
    dev.free();
    process.exit();
});

mapper_ready = false;
outputVal = 1;
var interval = setInterval (function () {
    // Your program
    if (!mapper_ready) {
	    console.log("waiting for device initialization...");
		mapper_ready = dev.ready;
		if (mapper_ready)
		    console.log("\n\nDevice ready!");
	}	
	else {
		//ready, do some signal updates
		outputVal = ( (outputVal+1) % 100);
		outsig.update(parseInt(outputVal));
	    
	}
    dev.poll(100);
}, 100);

