# ❓ DriveIQ - Frequently Asked Questions

Common questions and answers about the DriveIQ system.

---

## 🔧 Hardware Questions

### Q: Can I use ESP32 instead of ESP8266?
**A:** Yes! ESP32 will work with minor modifications:
- Change board selection in Arduino IDE to ESP32
- Update pin definitions (ESP32 uses GPIO21 for SDA, GPIO22 for SCL)
- WiFi library changes from `ESP8266WiFi.h` to `WiFi.h`

### Q: Will this work with other accelerometers like ADXL345?
**A:** Yes, but you'll need to modify the firmware:
- Install ADXL345 library
- Update sensor initialization code
- Adjust threshold values (ADXL345 has different sensitivity)

### Q: Do I need a separate GPS module?
**A:** No. The system simulates GPS for demonstration. However, you can add a NEO-6M GPS module for real coordinates.

### Q: Can I power the ESP8266 from my car's 12V socket?
**A:** Yes, but use a proper USB car charger (12V → 5V). Never connect 12V directly to the ESP8266!

### Q: My MPU6050 has 8 pins, not 6. Which ones do I use?
**A:** Use only: VCC, GND, SDA, SCL. Ignore XDA, XCL, AD0, INT pins for basic setup.

### Q: Does the system work while the car is moving?
**A:** Yes! That's exactly what it's designed for. Mount it securely and ensure WiFi stays connected (use mobile hotspot if needed).

---

## 💻 Software Questions

### Q: Can I use MongoDB instead of Firebase?
**A:** Yes! Modify `backend/app.py`:
```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['driveiq']
collection = db['vehicle_data']

# Replace Firebase writes with:
collection.insert_one(data)
```

### Q: Does it work on Raspberry Pi?
**A:** Yes! The backend runs perfectly on Raspberry Pi. Just install Python 3.8+ and follow the backend setup.

### Q: Can I access the dashboard from my phone?
**A:** Yes! If on the same WiFi, visit `http://YOUR_PC_IP:3000` from your phone's browser.

### Q: How do I change the risk score thresholds?
**A:** Edit `backend/app.py` in the `calculate_risk_score()` function. Adjust the penalty percentages.

### Q: Can I run this without internet?
**A:** Yes! As long as ESP8266 and your PC are on the same local network, it works offline. Data stores in-memory if Firebase isn't configured.

---

## 🌐 Network Questions

### Q: ESP8266 won't connect to my WiFi. Why?
**A:** Common causes:
1. Wrong SSID/password (case-sensitive)
2. 5GHz network (ESP8266 only supports 2.4GHz)
3. Hidden SSID (ESP8266 may have issues)
4. MAC filtering enabled on router
5. Too far from router

**Solution:** Use a 2.4GHz network or create a mobile hotspot.

### Q: Can I use this without WiFi?
**A:** Currently no, WiFi is required. However, you could modify firmware to log to SD card and sync later.

### Q: How much mobile data does it use?
**A:** Very little! Each JSON packet is ~200 bytes. Sending every 2 seconds = ~360KB per hour.

### Q: Can I use Bluetooth instead of WiFi?
**A:** Not directly with ESP8266. ESP32 supports Bluetooth and could be modified for BLE data transmission.

---

## 📊 Dashboard Questions

### Q: Dashboard shows "Offline" even though backend is running
**A:** Check:
1. Backend URL in `frontend/src/App.js` matches actual backend
2. CORS is enabled in Flask
3. No firewall blocking port 5000
4. Backend console shows "✓ Data received"

### Q: Charts are not updating in real-time
**A:** The dashboard fetches data every 2 seconds. If still not updating:
1. Check browser console (F12) for errors
2. Verify backend `/api/latest` endpoint responds
3. Clear browser cache and refresh

### Q: Can I customize the dashboard colors?
**A:** Yes! Edit `frontend/src/App.css`:
```css
:root {
  --primary-navy: #YOUR_COLOR;
  --primary-teal: #YOUR_COLOR;
}
```

### Q: How do I export data to Excel?
**A:** Currently not built-in, but you can:
1. Query Firebase/database directly
2. Add export API endpoint to backend
3. Use browser's "Save as CSV" on tables

---

## 🎯 Functionality Questions

### Q: How accurate is the risk score?
**A:** It's based on driving events detected by the MPU6050. Accuracy depends on:
- Proper sensor calibration
- Stable mounting in vehicle
- Threshold tuning for your driving style

### Q: Can I monitor multiple vehicles?
**A:** Yes! Use different device IDs in firmware:
```cpp
doc["device_id"] = "ESP8266_001";  // Change for each device
```
The admin panel already supports multiple drivers.

### Q: Does it detect all types of risky driving?
**A:** It detects:
- ✅ Overspeeding (simulated/configurable)
- ✅ Sudden braking
- ✅ Aggressive acceleration
- ✅ Sharp turns
- ❌ Tailgating (requires distance sensor)
- ❌ Lane changes (requires additional sensors)

### Q: Can I get SMS alerts for risky driving?
**A:** Not built-in yet, but you can add:
1. Twilio integration in backend
2. GSM module (SIM800L) on ESP8266
3. Email alerts via SMTP

### Q: How is speed calculated without a real speed sensor?
**A:** Currently simulated for demo purposes. For real speed:
1. Add GPS module (speed from GPS data)
2. Connect to vehicle OBD-II port
3. Use Hall effect sensor on wheel

---

## 🔒 Security Questions

### Q: Is my data secure?
**A:** 
- Firebase: Uses Google's security
- In-memory: Data lost on restart (not persistent)
- Local network: Only accessible on your WiFi
- HTTPS: Recommended for production deployment

### Q: Can someone hack my car through this?
**A:** No. This system only reads sensors, it doesn't control any vehicle functions.

### Q: Should I worry about exposing my backend API?
**A:** For production:
1. Add authentication (API keys)
2. Enable rate limiting
3. Use HTTPS
4. Restrict CORS origins

---

## 💰 Cost Questions

### Q: What's the total cost to build this?
**A:**
- Hardware: ~$10-15
- Backend hosting: Free (Railway/Heroku free tier)
- Frontend hosting: Free (Vercel/Netlify)
- Firebase: Free tier (50K reads/day)
- **Total: $10-15 one-time**

### Q: Are there any monthly fees?
**A:** Only if you exceed free tiers:
- Firebase: Free up to 50K reads/day
- Railway: $5/month if you exceed free hours
- Vercel/Netlify: Free for personal projects

### Q: Can I sell devices with this software?
**A:** Yes! It's MIT licensed. You can:
- Sell hardware with pre-installed firmware
- Offer as a service
- Modify and rebrand
- Just keep the original license notice

---

## 🛠️ Troubleshooting Questions

### Q: MPU6050 shows wrong orientation
**A:** The sensor might be mounted differently. Adjust axis mapping in firmware:
```cpp
// Swap axes if needed
int16_t ax_corrected = ay;  // Use Y as X
int16_t ay_corrected = ax;  // Use X as Y
```

### Q: Sensor values are drifting
**A:** MPU6050 has gyro drift. Solutions:
1. Calibrate sensor (see HARDWARE_GUIDE.md)
2. Implement complementary filter
3. Use Kalman filter for better accuracy

### Q: Backend crashes after a few hours
**A:** Could be memory leak. Solutions:
1. Limit in-memory data: Keep only last 1000 records
2. Use proper database (Firebase/MongoDB)
3. Add memory monitoring
4. Restart backend daily (cron job)

### Q: Arduino IDE says "Board not found"
**A:** 
1. Install USB drivers (CH340 or CP2102)
2. Check if COM port appears in Device Manager
3. Try different USB port/cable
4. Hold FLASH button while connecting

---

## 📈 Performance Questions

### Q: How many data points can the system handle?
**A:**
- In-memory: ~1000 (configurable)
- Firebase: Millions (with free tier limits)
- Backend: 100+ req/sec with Flask
- Frontend: Handles 10K+ data points in charts

### Q: Will the ESP8266 overheat in a hot car?
**A:** ESP8266 can handle up to 85°C. For hot climates:
1. Use heat sinks
2. Add ventilation holes to enclosure
3. Mount in shaded area
4. Consider ESP32 (better thermal management)

### Q: How often should data be sent?
**A:** Default is 2 seconds. Adjust in firmware:
```cpp
const unsigned long SEND_INTERVAL = 2000;  // Change to 5000 for 5 seconds
```
Longer interval = less data, better battery, less server load

---

## 🚀 Deployment Questions

### Q: Can I deploy this commercially?
**A:** Yes! MIT license allows commercial use. Consider:
1. Using proper databases (not in-memory)
2. Adding user authentication
3. Implementing proper security
4. Providing customer support

### Q: How do I update firmware on deployed devices?
**A:** Options:
1. Manual: Re-upload via USB
2. OTA: Implement Over-The-Air updates (ESP8266 supports this)
3. Pre-programmed: Flash devices before installation

### Q: Can this scale to 1000+ vehicles?
**A:** Yes, but you'll need:
1. Proper database (PostgreSQL/MongoDB)
2. Load balancer for backend
3. CDN for frontend
4. Caching layer (Redis)
5. Cloud hosting (AWS/GCP/Azure)

---

## 🔮 Future Questions

### Q: Will you add machine learning?
**A:** Planned! Future versions may include:
- Accident prediction
- Driver behavior patterns
- Anomaly detection
- Personalized recommendations

### Q: Can this integrate with insurance companies?
**A:** Potentially! Usage-based insurance (UBI) integration is possible with:
- Secure API for data sharing
- Privacy controls
- Driver consent
- Data anonymization

### Q: Will there be a mobile app?
**A:** Planned! React Native version is on the roadmap.

---

## 📞 Still Have Questions?

1. **Check Documentation**
   - README.md - Main documentation
   - QUICKSTART.md - Fast setup guide
   - HARDWARE_GUIDE.md - Wiring and mounting
   - DEPLOYMENT.md - Production deployment

2. **Search Issues**
   - GitHub Issues for known problems
   - Discussions for community help

3. **Ask the Community**
   - Open a GitHub Discussion
   - Tag relevant maintainers

---

<div align="center">

**Can't find your answer? Open an issue on GitHub! 💬**

</div>
