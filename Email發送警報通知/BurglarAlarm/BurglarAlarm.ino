#include <SPI.h>
#include <Ethernet.h>
#include "burglar_alarm.h"

const unsigned int PIR_INPUT_PIN = 2;
const unsigned int SMTP_PORT = 25;
const unsigned int BAUD_RATE = 9600;
const String       USERNAME  = "UmVnaXN0ZXJPbmVZb3Vyc2VsZg=="; // Encoded in Base64.
const String       PASSWORD  = "QWNjb3VudERvZXNOb3RFeGlzdA=="; // Encoded in Base64.
const String       MAIL_FROM = "YourSourceEmail@gmail.com";
const String       MAIL_TO   = "YourDestinationEmail@gmail.com";
const String       SUBJECT   = "Yet another subject";
const String       BODY      = "Yet another body";  

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
//IPAddress my_ip(192, 168, 2, 120);

const String smtp_server = "mail.smtp2go.com";
PassiveInfraredSensor pir_sensor(PIR_INPUT_PIN);
SmtpService           smtp_service(smtp_server, SMTP_PORT, USERNAME, PASSWORD);
BurglarAlarm          burglar_alarm(pir_sensor, smtp_service, MAIL_FROM, MAIL_TO, SUBJECT, BODY);
/*  BurglarAlarm有封裝上面信件的資訊的方法，你可以隨時動態去更新你得訊息或寄送來源或目的
 *  可使用 burglar_alarm.getFrom() 來取得目前類別的來源設定值
 *         burglar_alarm.setFrom() 來設定目前來源的設定值
 *         其他的可動用成員的方法同上形式，可自行到burglar_alarm.h查閱
 *         
 *         BurglarAlarm的建構子也有多形，如有興趣者可自行參閱burglar_alarm.h
*/
void setup() {
  Ethernet.begin(mac);
  Serial.begin(BAUD_RATE);
  delay(20 * 1000);
}

void loop() {
  burglar_alarm.check();
  delay(3000);
}
