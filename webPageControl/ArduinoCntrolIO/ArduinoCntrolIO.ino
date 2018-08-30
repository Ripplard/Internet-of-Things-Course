#include <Servo.h>

// 定義腳位
const int ledPin   = 3;
const int servoPin = 10;
// 定義一個servo物件
Servo servo;

// Arduino初始化
void setup() {
  // 設定串列埠的鮑率為9600，並開啟串列埠
  Serial.begin(9600);
  // 設定GPIO
  pinMode(ledPin, OUTPUT);
  servo.attach(servoPin);
  // 等待20ms等待串列埠開啟
  delay(20);
}

// 是否有參數輸入
String isParam(String str) {
  int index = str.lastIndexOf('/');
  if(index > 0){
    return str.substring(index + 1);
  }
  return "";
}

// 是否有關鍵字
bool isKeyword(String input, String keyword) {
  return input.indexOf(keyword) != -1;
}

// Arduino主程式
void loop() {
  // 串列埠是否收到訊息
  if (Serial.available() > 0) {
    // 將串列埠字元放入buffer並等待收到換行的跳脫字回傳字串
    String serialResponse = Serial.readStringUntil('\n');
    
    // 將led點亮
    if( isKeyword(serialResponse, "/ledon") ) {
      digitalWrite(ledPin, HIGH);
    }
    // 將led熄滅
    else if( isKeyword(serialResponse, "/ledoff") ) {
      digitalWrite(ledPin, LOW);
    }
    // 控制伺服馬達角度(0~180)
    else if( isKeyword(serialResponse, "/servo") ) {
      String val = isParam(serialResponse);
      if(val != "") servo.write(val.toInt());
    }
    // 控制LED的亮度
    else if( isKeyword(serialResponse, "/lightness") ) {
      String val = isParam(serialResponse);
      if(val != "") analogWrite(ledPin, val.toInt());
    }
  }
}
