#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ================= Wi-Fi =================
const char* ssid = "Moto";
const char* password = "Net illa";

// Laptop IP + Backend Port
const char* serverUrl = "http://10.237.22.235:5000/api/sensor/data";

// ================= Pins =================
#define DHTPIN 4
#define DHTTYPE DHT11

#define GREEN_LED_PIN 18
#define RED_LED_PIN 19

// ================= Thresholds =================
#define THRESHOLD_WARNING 30.0
#define THRESHOLD_HIGH 35.0

// ================= Timing =================
const unsigned long telemetryInterval = 3000;
unsigned long lastTelemetryTime = 0;

DHT dht(DHTPIN, DHTTYPE);


// =================================================
// SETUP
// =================================================
void setup() {

  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("==============================================");
  Serial.println("IoT Server Room Temperature Monitoring System");
  Serial.println("==============================================");

  // LED setup
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);

  // LED self-test
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, HIGH);

  delay(1000);

  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);

  // DHT11 setup
  dht.begin();

  Serial.println("[SENSOR] DHT11 Initialized");

  // Wi-Fi connection
  connectWiFi();
}


// =================================================
// MAIN LOOP
// =================================================
void loop() {

  // Check Wi-Fi
  if (WiFi.status() != WL_CONNECTED) {

    connectWiFi();

  }

  // Send data every 3 seconds
  unsigned long currentMillis = millis();

  if (currentMillis - lastTelemetryTime >= telemetryInterval) {

    lastTelemetryTime = currentMillis;

    processAndSendSensorData();

  }
}


// =================================================
// CONNECT TO WIFI
// =================================================
void connectWiFi() {

  Serial.println();
  Serial.print("[WIFI] Connecting to: ");
  Serial.println(ssid);

  // Reset Wi-Fi
  WiFi.disconnect(true);
  delay(1000);

  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, password);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20) {

    delay(500);

    Serial.print(".");

    attempts++;
  }

  Serial.println();

  // Connection successful
  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("[WIFI] Connected Successfully!");

    Serial.print("[WIFI] ESP32 IP Address: ");
    Serial.println(WiFi.localIP());

    Serial.print("[SERVER] Backend URL: ");
    Serial.println(serverUrl);

  }

  // Connection failed
  else {

    Serial.println("[WIFI] Connection Failed!");

    Serial.print("[WIFI] Status Code: ");
    Serial.println(WiFi.status());

  }
}


// =================================================
// READ SENSOR + SEND DATA
// =================================================
void processAndSendSensorData() {

  float temperature = dht.readTemperature();

  float humidity = dht.readHumidity();


  // Check sensor
  if (isnan(temperature) || isnan(humidity)) {

    Serial.println("[ERROR] Failed to read DHT11!");

    return;
  }


  // Display sensor values
  Serial.println("----------------------------------------------");

  Serial.printf(
    "[TELEMETRY] Temperature: %.1f °C | Humidity: %.1f %%\n",
    temperature,
    humidity
  );


  // =================================================
  // TEMPERATURE STATUS
  // =================================================

  String status;


  // NORMAL
  if (temperature <= THRESHOLD_WARNING) {

    status = "NORMAL";

    digitalWrite(GREEN_LED_PIN, HIGH);
    digitalWrite(RED_LED_PIN, LOW);

    Serial.println("[STATUS] NORMAL");
    Serial.println("[LED] Green ON | Red OFF");

  }


  // WARNING
  else if (temperature <= THRESHOLD_HIGH) {

    status = "WARNING";

    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, HIGH);

    Serial.println("[STATUS] WARNING");
    Serial.println("[LED] Green OFF | Red ON");

  }


  // HIGH TEMPERATURE
  else {

    status = "HIGH TEMPERATURE";

    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, HIGH);

    Serial.println("[STATUS] HIGH TEMPERATURE");
    Serial.println("[LED] Green OFF | Red ON");

  }


  // =================================================
  // SEND DATA TO BACKEND
  // =================================================

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    http.begin(serverUrl);

    http.addHeader("Content-Type", "application/json");


    // JSON data
    String jsonPayload =
      "{\"temperature\":" +
      String(temperature, 1) +
      ",\"humidity\":" +
      String(humidity, 1) +
      "}";


    Serial.print("[HTTP] Sending: ");
    Serial.println(jsonPayload);


    // POST request
    int responseCode = http.POST(jsonPayload);


    // Server response
    if (responseCode > 0) {

      Serial.print("[HTTP] Response Code: ");
      Serial.println(responseCode);

      String response = http.getString();

      Serial.print("[HTTP] Server Response: ");
      Serial.println(response);

    }

    else {

      Serial.print("[HTTP] Request Failed: ");
      Serial.println(
        http.errorToString(responseCode)
      );

    }


    http.end();

  }

  else {

    Serial.println("[HTTP] Wi-Fi not connected!");

  }
}
