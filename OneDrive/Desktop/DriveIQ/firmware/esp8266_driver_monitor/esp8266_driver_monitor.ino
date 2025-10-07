#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <MPU6050.h>
#include <ArduinoJson.h>

// ========== CONFIGURATION ==========
const char* WIFI_SSID = "YOUR_WIFI_SSID";        // Change this
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // Change this
const char* BACKEND_URL = "http://YOUR_BACKEND_IP:5000/api/vehicle-data"; // Change this

// MPU6050 Configuration
MPU6050 mpu;
int16_t ax, ay, az;
int16_t gx, gy, gz;

// Simulated Sensor Variables
float currentSpeed = 0;
float currentRPM = 0;
float currentThrottle = 0;

// Detection Variables
bool suddenBraking = false;
bool aggressiveAcceleration = false;
bool sharpTurn = false;
bool overspeed = false;

// Thresholds
const float OVERSPEED_THRESHOLD = 80.0;      // km/h
const float ACCEL_THRESHOLD = 15000;          // Raw MPU6050 value
const float BRAKE_THRESHOLD = -15000;         // Raw MPU6050 value
const float TURN_THRESHOLD = 20000;           // Raw MPU6050 gyro value

// Timing
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 2000;     // Send data every 2 seconds

// GPS Simulation (Pre-defined route)
const float GPS_COORDS[][2] = {
  {12.9716, 77.5946},  // Bangalore coordinates
  {12.9756, 77.5986},
  {12.9796, 77.6026},
  {12.9836, 77.6066},
  {12.9876, 77.6106}
};
int gpsIndex = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n====================================");
  Serial.println("DriveIQ - Driver Risk Score Monitor");
  Serial.println("====================================\n");
  
  // Initialize I2C for MPU6050
  Wire.begin(D2, D1); // SDA = D2, SCL = D1
  
  // Initialize MPU6050
  Serial.println("Initializing MPU6050...");
  mpu.initialize();
  
  if (mpu.testConnection()) {
    Serial.println("✓ MPU6050 connected successfully!");
  } else {
    Serial.println("✗ MPU6050 connection failed!");
    while (1) {
      delay(1000);
    }
  }
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 30) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi connection failed!");
  }
  
  Serial.println("\nStarting sensor monitoring...\n");
}

void loop() {
  // Read MPU6050 data
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
  // Simulate speed variation (realistic driving)
  static unsigned long lastSpeedUpdate = 0;
  if (millis() - lastSpeedUpdate > 500) {
    currentSpeed += random(-5, 8) * 0.5;
    currentSpeed = constrain(currentSpeed, 0, 120);
    
    currentRPM = currentSpeed * 30 + random(-100, 100);
    currentRPM = constrain(currentRPM, 800, 5000);
    
    currentThrottle = map(currentSpeed, 0, 120, 0, 100);
    
    lastSpeedUpdate = millis();
  }
  
  // Detect driving events
  detectDrivingEvents();
  
  // Send data to backend every 2 seconds
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    sendDataToBackend();
    lastSendTime = millis();
    
    // Update GPS simulation
    gpsIndex = (gpsIndex + 1) % (sizeof(GPS_COORDS) / sizeof(GPS_COORDS[0]));
  }
  
  delay(50);
}

void detectDrivingEvents() {
  // Detect aggressive acceleration (forward)
  if (ax > ACCEL_THRESHOLD) {
    aggressiveAcceleration = true;
    Serial.println("⚠️  Aggressive Acceleration Detected!");
  } else {
    aggressiveAcceleration = false;
  }
  
  // Detect sudden braking (backward)
  if (ax < BRAKE_THRESHOLD) {
    suddenBraking = true;
    Serial.println("⚠️  Sudden Braking Detected!");
  } else {
    suddenBraking = false;
  }
  
  // Detect sharp turn (gyroscope Z-axis)
  if (abs(gz) > TURN_THRESHOLD) {
    sharpTurn = true;
    Serial.println("⚠️  Sharp Turn Detected!");
  } else {
    sharpTurn = false;
  }
  
  // Detect overspeed
  if (currentSpeed > OVERSPEED_THRESHOLD) {
    overspeed = true;
  } else {
    overspeed = false;
  }
}

void sendDataToBackend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ WiFi not connected. Skipping data send.");
    return;
  }
  
  WiFiClient client;
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  
  doc["device_id"] = "ESP8266_001";
  doc["speed"] = round(currentSpeed * 10) / 10.0;
  doc["rpm"] = (int)currentRPM;
  doc["throttle"] = (int)currentThrottle;
  doc["acceleration"] = ax / 1000.0;
  doc["braking"] = suddenBraking ? 1 : 0;
  doc["sharp_turn"] = sharpTurn ? 1 : 0;
  doc["overspeed"] = overspeed ? 1 : 0;
  doc["aggressive_accel"] = aggressiveAcceleration ? 1 : 0;
  doc["latitude"] = GPS_COORDS[gpsIndex][0];
  doc["longitude"] = GPS_COORDS[gpsIndex][1];
  doc["timestamp"] = getTimestamp();
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  // Send HTTP POST request
  http.begin(client, BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  
  Serial.println("─────────────────────────────────");
  Serial.print("Sending data: ");
  Serial.println(jsonPayload);
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    Serial.print("✓ Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
  } else {
    Serial.print("✗ Error sending data. Code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
  
  // Print sensor summary
  Serial.println("\n📊 Current Metrics:");
  Serial.print("Speed: "); Serial.print(currentSpeed); Serial.println(" km/h");
  Serial.print("RPM: "); Serial.println((int)currentRPM);
  Serial.print("Accel (X): "); Serial.println(ax);
  Serial.print("Gyro (Z): "); Serial.println(gz);
  Serial.println("─────────────────────────────────\n");
}

String getTimestamp() {
  // Simple timestamp (seconds since boot)
  // For production, use NTP server for real time
  unsigned long seconds = millis() / 1000;
  return "2025-10-06T" + String(12 + (seconds / 3600) % 12) + ":" + 
         String((seconds / 60) % 60) + ":" + String(seconds % 60) + "Z";
}
