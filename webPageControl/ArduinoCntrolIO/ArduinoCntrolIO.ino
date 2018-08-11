#include <Servo.h>

// 定義腳位
const int ledPin   = 3;
const int servoPin = 10;

Servo servo;
void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  servo.attach(servoPin);
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

String data;
void loop() {
  if (Serial.available() > 0) {
    String serialResponse = Serial.readStringUntil('\n');
      // Serial.println(serialResponse);
      
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
