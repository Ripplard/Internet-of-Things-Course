const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const app = express();

// 你的arduino串列埠
const arduino_port = new SerialPort('COM32');
// 你的伺服器通訊埠
const server_port = '3000';
const parser = arduino_port.pipe(new Readline({ delimiter: '\r\n' }));

var serial_data = [];

parser.on('data', function(data){
	console.log(data);
	serial_data.push(data);
});

app.use('/js',express.static(__dirname + '/js'));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/dynamic', (req, res) => res.sendFile(__dirname + '/index_dynamic.html'));

app.get('/data', (req, res) => res.send(serial_data));

app.listen(server_port, () => console.log('Example app listening on port', server_port, '!'));
