const SerialPort = require('serialport');
const express = require('express');
const app = express();

// 你的arduino串列埠
const arduino_port = new SerialPort('COM8');
// 你的伺服器通訊埠
const server_port = '3005';


// 當成功與串列埠建立連線觸發
arduino_port.on('open', function () {
  console.log('Arduino Serial Port Connected!');
});

// 加載檔案目錄js，並也將它提供到/js的url下
app.use('/js',express.static(__dirname + '/js'));

// 印出url的請求訊息
app.use('/', (req, res, next) => {
  const url = req.url.toString();
  // 判斷不是為首頁url和頁籤的圖示url才觸發
  if(url !== '/' && url !== '/favicon.ico'){
    console.log(req.url.toString());
  }
  // 向下檢查是否有其他中介規則
  next();
});

// 使用者前端人機介面的url
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 當為無須數值丟入的控制物件(如開關LED)
app.get('/:item', (req, res) => {
  // 將url的參數丟給Arduino做處理
  arduino_port.write(req.url.toString() + '\n');
  // 重新導向首頁
  res.redirect('/');
});

// 當為須數值丟入的控制物件(如LED的明亮、伺服馬達的位置控制)
app.get('/:item/:val', (req, res) => {
  const value = req.params;
  // 將url的參數丟給Arduino做處理
  arduino_port.write(req.url.toString() + '\n');
  // 重新導向首頁
  res.redirect('/');
});

// 開始監聽port
app.listen(server_port, () => console.log('Example app listening on port', server_port, '!'));