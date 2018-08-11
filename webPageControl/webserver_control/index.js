const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const app = express();

// 你的arduino串列埠
const arduino_port = new SerialPort('COM8');
// 你的伺服器通訊埠
const server_port = '3005';

// 定義斷句的規則
const parser = arduino_port.pipe(new Readline({ delimiter: '\r\n' }));

// 當成功與串列埠建立連線觸發
arduino_port.on('open', function () {
  console.log('Arduino Serial Port Connected!');
});

// 串列埠完成分割觸發
parser.on('data', function(data){
	console.log(data);
});

// 加載檔案目錄js，並也將它提供到/js的url下
app.use('/js',express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/:item', (req, res) => {
  arduino_port.write(req.url.toString() + '\n');
  res.redirect('/');
});

app.get('/:item/:val', (req, res) => {
  const value = req.params;
  console.log("obj:",value);
  arduino_port.write(req.url.toString() + '\n');
  res.redirect('/');
});

app.listen(server_port, () => console.log('Example app listening on port', server_port, '!'));