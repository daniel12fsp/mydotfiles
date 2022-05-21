const net = require('net');

const client = new net.Socket();
client.connect("/tmp/rofi_notification_daemon",() => client.write('num\n'));

client.on('data', function(data) {
    console.log(data.toString().split(",")[0]);
    client.destroy();    
});