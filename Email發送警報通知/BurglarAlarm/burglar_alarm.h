/***
 * Excerpted from "Arduino: A Quick-Start Guide, Second Edition",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/msard2 for more book information.
***/
#ifndef __BURGLAR_ALARM_H__
#define __BURGLAR_ALARM_H__
#include "pir_sensor.h"
#include "smtp_service.h"

class BurglarAlarm {
  PassiveInfraredSensor _pir_sensor;
  SmtpService           _smtp_service;
  String                _from   = "YourSourceEmail@gmail.com";
  String                _to     = "YourDestinationEmail@gmail.com";
  String                _subject= "Yet another subject";
  String                _body   = "Yet another body";
  void send_alarm() {
    Email email(
      _from,
      _to,
      _subject,
      _body
    );
    _smtp_service.send_email(email);
  }
 
  public:
  BurglarAlarm( 
    const PassiveInfraredSensor& pir_sensor,
    const SmtpService&           smtp_service,
    const String& from,
    const String& to) :
      _pir_sensor(pir_sensor),
      _smtp_service(smtp_service),
      _from(from), _to(to){ }
  BurglarAlarm( 
    const PassiveInfraredSensor& pir_sensor,
    const SmtpService&           smtp_service) :
      _pir_sensor(pir_sensor),
      _smtp_service(smtp_service){ }
  BurglarAlarm( 
    const PassiveInfraredSensor& pir_sensor,
    const SmtpService&           smtp_service,
    const String& from,
    const String& to,
    const String& subject,
    const String& body) :
      _pir_sensor(pir_sensor),
      _smtp_service(smtp_service),
      _from(from), _to(to), _subject(subject), _body(body) { }
  
  const String& getFrom()    const { return _from; }
  const String& getTo()      const { return _to; }
  const String& getSubject() const { return _subject; }
  const String& getBody()    const { return _body; }

  void setFrom(const String from) { _from = from; }
  void setTo(const String to) { _to = to; }
  void setSubject(const String subject) { _subject = subject; }
  void setBody(const String body) { _body = body; }  
  
  void check() {
    Serial.println("Checking");
    if (_pir_sensor.motion_detected()) {
      Serial.println("Intruder detected!");
      send_alarm();
    }
  }
};
#endif
