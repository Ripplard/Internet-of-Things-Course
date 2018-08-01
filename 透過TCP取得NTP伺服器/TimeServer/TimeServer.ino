#include <SPI.h>
#include <Ethernet.h>
const unsigned int BAUD_RATE = 9600;
const unsigned int DAYTIME_PORT = 13;

// 裝置mac位址
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
// IP位址
IPAddress my_ip(192, 168, 1, 120);
// 連線至NTP伺服器的IP位址，請用nslookup查找
IPAddress time_server(132, 163, 97, 1); // time.nist.gov
EthernetClient client; 

void setup() {
  // 開啟串列埠
  Serial.begin(BAUD_RATE);
  // 開啟網路串列埠
  Ethernet.begin(mac, my_ip); 
}

void loop() {
  // 等待4秒，因NTP伺服器每次請求間隔必須大於4秒
  delay(4000);
  Serial.print("Connecting...");
  
  if (client.connect(time_server, DAYTIME_PORT) <= 0) { 
    Serial.println("connection failed.");
  } else {
    Serial.println("connected.");
    delay(300);
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
    
    Serial.println("Disconnecting.");
    client.stop();
  }
}

