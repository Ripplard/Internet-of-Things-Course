const os = require('os');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const app = express();

// 引入console字形跳脫字元顏色表
const cclor = require('./consoleColor.js');

// 你的arduino串列埠
const arduino_port = new SerialPort('COM32');
// 你的伺服器通訊埠
const server_port = '3000';
const parser = arduino_port.pipe(new Readline({ delimiter: '\r\n' }));

// 串列資料保存陣列
var serial_data = [];

// 當取得Arduino串列埠的斷句資料
parser.on('data', function (data) {
	console.log(data);
	serial_data.push(data);
});

// 加載檔案目錄js，並也將它提供到/js的url下
app.use('/js', express.static(__dirname + '/js'));

// 靜態繪圖URL
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// 動態繪圖URL
app.get('/dynamic', (req, res) => {
	res.sendFile(__dirname + '/index_dynamic.html');
});

// 用於繪圖取得資料
app.get('/data', (req, res) => res.send(serial_data));

app.listen(server_port, () => {
	// 取得網卡IP
	var IPv4;
	// 取得網路資訊
	var ifconfig = os.networkInterfaces();

	// 如有偵測到預設網卡
	if(ifconfig.hasOwnProperty('乙太網路')) {
		for (var i = 0; i < ifconfig['乙太網路'].length; i++) {
			if (ifconfig['乙太網路'][i].family == 'IPv4') {
				// 取得IP位置
				IPv4 = ifconfig['乙太網路'][i].address;
			}
		}
		// 印出伺服器實體http的URL
		console.log(cclor.Reset + cclor.hold + cclor.FgYellow + cclor.hold + cclor.Reset + cclor.hold ,
					'Example app listening running at \"' ,
					'http://' + IPv4 + ':' + server_port ,
					 "\"" );
	}
	else{
		// 印出伺服器的監聽序列埠
		console.log(cclor.hold + cclor.FgYellow + cclor.hold + cclor.Reset + cclor.hold,
					'Example app listening running at port \"' ,
					server_port ,
					"\"" );
	}
});