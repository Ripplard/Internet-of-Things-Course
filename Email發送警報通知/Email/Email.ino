#include <SPI.h>
#include <Ethernet.h>
#include "smtp_service.h"

const unsigned int SMTP_PORT = 2525;
const unsigned int BAUD_RATE = 9600;
const String       USERNAME  = "UmVnaXN0ZXJPbmVZb3Vyc2VsZg=="; // Encoded in Base64.
const String       PASSWORD  = "QWNjb3VudERvZXNOb3RFeGlzdA=="; // Encoded in Base64.
const String       MAIL_FROM = "YourSourceEmail@gmail.com";
const String       MAIL_TO   = "YourDestinationEmail@gmail.com";
const String       SUBJECT   = "Yet another subject";
const String       BODY   = "Yet another body";  

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
const String smtp_server = "mail.smtp2go.com";
SmtpService smtp_service(smtp_server, SMTP_PORT, USERNAME, PASSWORD);

void setup() {
  Ethernet.begin(mac);
  Serial.begin(BAUD_RATE);
  delay(1000);
  Email email( 
    MAIL_FROM,
    MAIL_TO,
    SUBJECT,
    BODY
  );
  smtp_service.send_email(email);
}

void loop() {}

