# 🚀 DriveIQ Quick Start Guide

Get your IoT Driver Risk Score system running in **15 minutes**!

---

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Hardware Setup (5 mins)

**Connect MPU6050 to ESP8266:**
```
ESP8266 NodeMCU  →  MPU6050
─────────────────────────────
    3.3V         →   VCC
    GND          →   GND
    D2           →   SDA
    D1           →   SCL
```

**Plug ESP8266 into your computer via USB.**

---

### 2️⃣ Upload Firmware (5 mins)

1. **Open Arduino IDE**
2. **Open:** `firmware/esp8266_driver_monitor/esp8266_driver_monitor.ino`
3. **Edit lines 9-11:**
   ```cpp
   const char* WIFI_SSID = "YourWiFiName";
   const char* WIFI_PASSWORD = "YourWiFiPassword";
   const char* BACKEND_URL = "http://192.168.1.XXX:5000/api/vehicle-data";
   ```
   *(Replace `192.168.1.XXX` with your PC's IP address)*

4. **Install Libraries:**
   - Tools → Manage Libraries
   - Search & Install: **MPU6050** (by Electronic Cats)
   - Search & Install: **ArduinoJson** (version 6.x)

5. **Select Board:**
   - Tools → Board → ESP8266 Boards → **NodeMCU 1.0 (ESP-12E Module)**
   - Tools → Port → *(Select your COM port)*

6. **Upload:** Click the **Upload** button (→)
7. **Open Serial Monitor** (Ctrl+Shift+M) - You should see WiFi connection status

---

### 3️⃣ Start Backend & Frontend (5 mins)

#### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
✓ Backend running on http://0.0.0.0:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```
✓ Dashboard opens at http://localhost:3000

---

## 🎉 You're Done!

Your dashboard should now show:
- ✅ **"Live"** status indicator (green)
- ✅ Real-time risk score updating every 2 seconds
- ✅ Speed, RPM, and event metrics
- ✅ Charts and visualizations

---

## 📱 How to Find Your PC's IP Address

### Windows
```bash
ipconfig
```
Look for **IPv4 Address** under your active network adapter (e.g., `192.168.1.5`)

### Mac/Linux
```bash
ifconfig
# or
ip addr show
```
Look for **inet** address (e.g., `192.168.1.5`)

---

## 🔧 Common Issues

### ❌ ESP8266 not uploading
- **Check:** USB cable supports data transfer (not just charging)
- **Install:** CH340 or CP2102 drivers for your ESP8266
- **Try:** Different USB port

### ❌ WiFi not connecting
- **Check:** 2.4GHz network (ESP8266 doesn't support 5GHz)
- **Verify:** SSID and password are correct
- **Try:** Hotspot from your phone

### ❌ HTTP Error -1
- **Check:** Backend is running (`python app.py`)
- **Verify:** PC and ESP8266 are on the same network
- **Update:** Backend URL with correct IP address
- **Disable:** Windows Firewall temporarily to test

### ❌ Dashboard shows "Offline"
- **Check:** Backend is running on port 5000
- **Verify:** No browser console errors (F12)
- **Update:** `BACKEND_URL` in `frontend/src/App.js` if needed

---

## 🧪 Testing Without Hardware

**Don't have ESP8266/MPU6050?** You can still test the system!

### Simulate Data with Python Script

Create `backend/simulate_data.py`:
```python
import requests
import random
import time
from datetime import datetime

BACKEND_URL = "http://localhost:5000/api/vehicle-data"

while True:
    data = {
        "device_id": "SIMULATOR_001",
        "speed": random.uniform(40, 90),
        "rpm": random.randint(1500, 3500),
        "throttle": random.randint(30, 80),
        "acceleration": random.uniform(-2, 2),
        "braking": 1 if random.random() > 0.9 else 0,
        "sharp_turn": 1 if random.random() > 0.85 else 0,
        "overspeed": 1 if random.random() > 0.8 else 0,
        "aggressive_accel": 1 if random.random() > 0.87 else 0,
        "latitude": 12.9716 + random.uniform(-0.01, 0.01),
        "longitude": 77.5946 + random.uniform(-0.01, 0.01),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    try:
        response = requests.post(BACKEND_URL, json=data)
        print(f"✓ Sent data - Risk Score: {response.json()['risk_score']}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    time.sleep(2)
```

Run it:
```bash
cd backend
python simulate_data.py
```

Now your dashboard will show live data without any hardware!

---

## 📚 Next Steps

1. **Explore Dashboard** - Try all three pages (Dashboard, Insights, Admin)
2. **Toggle Dark Mode** - Click moon/sun icon
3. **Test Events** - Shake the MPU6050 to trigger events
4. **Read Full README** - See `README.md` for detailed documentation
5. **Deploy to Cloud** - Follow deployment section in README

---

## 🆘 Need Help?

- **Check Serial Monitor** - See what ESP8266 is doing
- **Check Browser Console** - Press F12 to see errors
- **Check Backend Logs** - Terminal running `python app.py`
- **Read Troubleshooting** - See README.md section

---

## 🎯 System Architecture Overview

```
ESP8266 → Reads MPU6050 + Simulates Speed/RPM
    ↓
Wi-Fi → Sends JSON every 2 seconds
    ↓
Flask Backend → Calculates Risk Score
    ↓
Firebase (Optional) → Stores Data
    ↓
React Dashboard → Shows Real-time Metrics
```

---

<div align="center">

**Happy Monitoring! 🚗💨**

*If everything works, give it a ⭐ star!*

</div>
