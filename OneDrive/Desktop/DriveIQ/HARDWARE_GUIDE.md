# 🔌 DriveIQ Hardware Setup Guide

Complete guide for wiring and configuring hardware components.

---

## 📦 Components List

### Required Components
| Component | Quantity | Approx. Cost | Purchase Link |
|-----------|----------|--------------|---------------|
| **ESP8266 NodeMCU** | 1 | $3-5 | Amazon, AliExpress |
| **MPU6050** | 1 | $2-3 | Amazon, AliExpress |
| **Jumper Wires (F-F)** | 4 | $1 | Amazon, AliExpress |
| **USB Micro Cable** | 1 | $2 | Amazon, Local store |
| **Breadboard (Optional)** | 1 | $2 | Amazon, AliExpress |

**Total Cost: ~$10-15**

### Optional Components (Future Upgrades)
| Component | Purpose | Cost |
|-----------|---------|------|
| **GPS Module (NEO-6M)** | Real GPS tracking | $5-8 |
| **GSM Module (SIM800L)** | SMS alerts | $5-10 |
| **SD Card Module** | Offline data logging | $3-5 |
| **OLED Display (0.96")** | Real-time display | $3-5 |
| **Buzzer** | Audio alerts | $1 |
| **Power Bank** | Portable power | $10-20 |

---

## 🔧 ESP8266 NodeMCU Pinout

```
                    ┌─────────────┐
                    │     USB     │
                    └─────────────┘
                           ││
    ┌──────────────────────────────────────┐
    │                                       │
    │  D0  D1  D2  D3  D4  3V3 GND D5  D6  │
    │  ●   ●   ●   ●   ●   ●   ●   ●   ●   │
    │                                       │
    │         ESP8266 NodeMCU               │
    │                                       │
    │  ●   ●   ●   ●   ●   ●   ●   ●   ●   │
    │  3V3 GND D7  D8  RX  TX  A0  RST EN  │
    └──────────────────────────────────────┘

Key Pins for DriveIQ:
- D1 (GPIO5)  → I2C SCL (MPU6050)
- D2 (GPIO4)  → I2C SDA (MPU6050)
- 3.3V        → Power supply
- GND         → Ground
```

---

## 🔌 Wiring Diagram

### MPU6050 to ESP8266

```
┌─────────────────┐           ┌─────────────────┐
│    ESP8266      │           │     MPU6050     │
│    NodeMCU      │           │                 │
│                 │           │                 │
│  ┌───┐          │           │          ┌───┐  │
│  │3V3├──────────┼───────────┼──────────┤VCC│  │
│  └───┘          │           │          └───┘  │
│                 │           │                 │
│  ┌───┐          │           │          ┌───┐  │
│  │GND├──────────┼───────────┼──────────┤GND│  │
│  └───┘          │           │          └───┘  │
│                 │           │                 │
│  ┌───┐          │           │          ┌───┐  │
│  │D2 ├──────────┼───────────┼──────────┤SDA│  │
│  └───┘          │  (GPIO4)  │          └───┘  │
│                 │           │                 │
│  ┌───┐          │           │          ┌───┐  │
│  │D1 ├──────────┼───────────┼──────────┤SCL│  │
│  └───┘          │  (GPIO5)  │          └───┘  │
│                 │           │                 │
└─────────────────┘           └─────────────────┘
```

### Connection Table
| ESP8266 Pin | MPU6050 Pin | Wire Color (Suggested) | Function |
|-------------|-------------|------------------------|----------|
| **3.3V** | **VCC** | Red | Power (+3.3V) |
| **GND** | **GND** | Black | Ground |
| **D2 (GPIO4)** | **SDA** | Blue | I2C Data |
| **D1 (GPIO5)** | **SCL** | Yellow | I2C Clock |

---

## 🛠️ Step-by-Step Assembly

### Step 1: Identify Components
1. **ESP8266 NodeMCU** - Should have micro USB port and "NodeMCU" label
2. **MPU6050** - Small purple/blue board with 6 pins (some have 8)
3. **Jumper Wires** - Female-to-Female recommended

### Step 2: Prepare MPU6050
- If your MPU6050 doesn't have pins soldered, solder them first
- Ensure pins are straight and secure

### Step 3: Connect Wires
```
1. Red Wire:     ESP8266 3.3V  → MPU6050 VCC
2. Black Wire:   ESP8266 GND   → MPU6050 GND
3. Blue Wire:    ESP8266 D2    → MPU6050 SDA
4. Yellow Wire:  ESP8266 D1    → MPU6050 SCL
```

### Step 4: Double-Check Connections
⚠️ **CRITICAL:** 
- Do NOT connect MPU6050 VCC to 5V (will damage sensor)
- Use 3.3V only!
- Verify GND is connected properly

### Step 5: Physical Mounting (Vehicle Installation)
```
Option 1: Dashboard Mount
- Use velcro or double-sided tape
- Position ESP8266 near power source
- Keep MPU6050 stable and level

Option 2: Under Seat
- More discreet
- Protected from sun
- Requires longer USB cable

Option 3: Breadboard (Testing)
- Use breadboard for easy testing
- Mount both components on breadboard
- Cleaner wiring during development
```

---

## ⚡ Power Options

### Option 1: USB from Laptop (Development)
```
Laptop USB Port → Micro USB Cable → ESP8266
✓ Easy for testing
✓ Serial monitor available
✗ Not portable
```

### Option 2: USB Power Bank (Portable)
```
Power Bank → Micro USB Cable → ESP8266
✓ Portable
✓ Long runtime (10+ hours)
✓ Perfect for vehicle testing
```

### Option 3: Car USB Charger (Production)
```
Car 12V Socket → USB Car Charger → Micro USB → ESP8266
✓ Always powered when car is running
✓ No battery needed
⚠️ May lose data when car turns off
```

### Option 4: Vehicle Battery (Advanced)
```
Car 12V Battery → DC-DC Buck Converter (12V→5V) → ESP8266
✓ Always powered
✓ Can log even when car is off
⚠️ Risk of draining car battery
⚠️ Requires proper voltage regulation
```

---

## 🧪 Testing Hardware

### Test 1: Power Check
```
1. Connect ESP8266 to USB
2. Blue LED should light up on NodeMCU
3. If no light → check USB cable (must support data)
```

### Test 2: MPU6050 Detection
```cpp
// Upload this test code:
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(D2, D1);
  
  Serial.println("Scanning I2C...");
  byte error, address;
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Device found at 0x");
      Serial.println(address, HEX);
    }
  }
}

void loop() {}
```

Expected Output:
```
Scanning I2C...
Device found at 0x68  ← This is MPU6050!
```

### Test 3: MPU6050 Data Reading
```
Upload the main firmware and check Serial Monitor:
✓ "MPU6050 connected successfully!"
✓ Acceleration values changing when moved
✓ WiFi connected
✓ Data being sent to backend
```

---

## 🚗 Vehicle Installation Guide

### Placement Recommendations

#### ✅ Best Positions:
1. **Dashboard Center** - Best for detecting all movements
2. **Below Dashboard** - Protected, stable mounting
3. **Center Console** - Easy to access, stable

#### ❌ Avoid:
1. **Glove Box** - May miss some events
2. **Door Pockets** - Too much vibration
3. **Trunk** - Wrong orientation for acceleration

### Orientation
```
┌─────────────────────┐
│                     │  ← Front of Vehicle
│     [ESP8266]       │
│     [MPU6050]       │
│                     │
└─────────────────────┘

MPU6050 X-axis → Forward/Backward (Acceleration/Braking)
MPU6050 Y-axis → Left/Right (Turns)
MPU6050 Z-axis → Up/Down (Bumps)
```

### Mounting Methods
```
1. Double-sided foam tape (removable)
2. Velcro strips (adjustable)
3. 3D printed enclosure with mounting brackets
4. Plastic project box with screws
```

---

## 🔋 Power Consumption

| Component | Current Draw | Power |
|-----------|--------------|-------|
| ESP8266 (Active WiFi) | ~80mA | ~264mW |
| MPU6050 | ~3.5mA | ~11.5mW |
| **Total** | **~85mA** | **~280mW** |

**Battery Life Calculations:**
- 10,000mAh Power Bank: ~117 hours (5+ days)
- 5,000mAh Power Bank: ~58 hours (2.5+ days)
- Car USB (unlimited while car is running)

---

## 🐛 Hardware Troubleshooting

### MPU6050 Not Detected

**Problem:** `✗ MPU6050 connection failed!`

**Solutions:**
```
1. Check wiring:
   - SDA to D2 (not D1)
   - SCL to D1 (not D2)
   - VCC to 3.3V (NOT 5V!)
   
2. Try different I2C address:
   // Add to setup():
   mpu.setI2CAddr(0x69);  // Alternative address
   
3. Check solder joints on MPU6050 pins
   
4. Try pull-up resistors (4.7kΩ on SDA and SCL)
```

### WiFi Connection Issues

**Problem:** WiFi won't connect

**Solutions:**
```
1. Verify SSID and password (case-sensitive)
2. Check if network is 2.4GHz (ESP8266 doesn't support 5GHz)
3. Move closer to router
4. Disable MAC filtering temporarily
5. Try mobile hotspot for testing
```

### Erratic Sensor Readings

**Problem:** Random values or noise

**Solutions:**
```
1. Secure loose connections
2. Add capacitor (100nF) between VCC and GND of MPU6050
3. Keep wires short (<15cm)
4. Avoid running near high-voltage wires
5. Calibrate MPU6050:
   // Add to setup():
   mpu.setXAccelOffset(-1234);
   mpu.setYAccelOffset(567);
   mpu.setZAccelOffset(890);
```

### ESP8266 Not Programming

**Problem:** Upload fails

**Solutions:**
```
1. Check USB cable (must support data, not just charging)
2. Install CH340/CP2102 USB drivers
3. Select correct COM port in Arduino IDE
4. Hold FLASH button during upload
5. Lower upload speed (115200 → 57600)
```

---

## 🔬 Advanced Calibration

### MPU6050 Calibration Procedure

```cpp
// Run this calibration code once:
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin(D2, D1);
  mpu.initialize();
  
  Serial.println("Place sensor on flat surface. Starting in 3s...");
  delay(3000);
  
  long axSum = 0, aySum = 0, azSum = 0;
  long gxSum = 0, gySum = 0, gzSum = 0;
  
  for(int i = 0; i < 1000; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
    
    axSum += ax;
    aySum += ay;
    azSum += az;
    gxSum += gx;
    gySum += gy;
    gzSum += gz;
    
    delay(10);
  }
  
  Serial.println("Calibration Offsets:");
  Serial.print("X Accel: "); Serial.println(axSum / 1000);
  Serial.print("Y Accel: "); Serial.println(aySum / 1000);
  Serial.print("Z Accel: "); Serial.println((azSum / 1000) - 16384); // Gravity
  Serial.print("X Gyro: "); Serial.println(gxSum / 1000);
  Serial.print("Y Gyro: "); Serial.println(gySum / 1000);
  Serial.print("Z Gyro: "); Serial.println(gzSum / 1000);
}

void loop() {}
```

Add the printed offsets to your main code:
```cpp
mpu.setXAccelOffset(YOUR_X_VALUE);
mpu.setYAccelOffset(YOUR_Y_VALUE);
mpu.setZAccelOffset(YOUR_Z_VALUE);
mpu.setXGyroOffset(YOUR_GX_VALUE);
mpu.setYGyroOffset(YOUR_GY_VALUE);
mpu.setZGyroOffset(YOUR_GZ_VALUE);
```

---

## 📊 Sensor Specifications

### MPU6050 Technical Specs
| Parameter | Value |
|-----------|-------|
| **Accelerometer Range** | ±2g, ±4g, ±8g, ±16g |
| **Gyroscope Range** | ±250°/s, ±500°/s, ±1000°/s, ±2000°/s |
| **ADC Resolution** | 16-bit |
| **Operating Voltage** | 2.375V - 3.46V (3.3V typical) |
| **Current Consumption** | 3.5mA |
| **I2C Clock** | 400kHz max |
| **Temperature Range** | -40°C to +85°C |

### ESP8266 Technical Specs
| Parameter | Value |
|-----------|-------|
| **CPU** | 80MHz / 160MHz |
| **RAM** | 80KB |
| **Flash** | 4MB |
| **WiFi** | 802.11 b/g/n (2.4GHz) |
| **GPIO Pins** | 17 |
| **ADC** | 1 (10-bit) |
| **Operating Voltage** | 3.3V |
| **Input Voltage** | 5V (via USB) |

---

## 🎯 Production Tips

### Enclosure Design
```
Recommended Enclosure:
- Size: 80mm x 60mm x 30mm
- Material: ABS plastic or 3D printed
- Features:
  ✓ Ventilation holes for heat
  ✓ LED visible through case
  ✓ USB port accessible
  ✓ Mounting holes for vehicle
```

### Cable Management
```
1. Use cable clips to secure USB cable
2. Route cables away from pedals and controls
3. Leave slack for movement
4. Use heat shrink tube for protection
```

### Long-term Reliability
```
1. Check connections monthly
2. Clean dust with compressed air
3. Update firmware periodically
4. Monitor for loose wires
5. Replace power cable if damaged
```

---

<div align="center">

**Hardware setup complete! 🎉**

Next: Upload firmware and test the system

</div>
