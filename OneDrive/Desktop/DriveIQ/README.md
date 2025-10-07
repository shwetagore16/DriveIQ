# 🚗 DriveIQ - Hybrid IoT Driver Risk Score System

<div align="center">

![DriveIQ Banner](https://img.shields.io/badge/DriveIQ-Driver_Risk_Score-00BFA6?style=for-the-badge)
[![ESP8266](https://img.shields.io/badge/ESP8266-IoT-1A1F71?style=flat-square)](https://www.espressif.com/)
[![MPU6050](https://img.shields.io/badge/MPU6050-Sensor-00BFA6?style=flat-square)](https://invensense.tdk.com/)
[![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Database-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

**A world-class IoT system that monitors driver behavior in real-time and calculates a risk score (0-100) using ESP8266, MPU6050, and a stunning web dashboard.**

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Hardware Requirements](#-hardware-requirements)
- [Software Stack](#-software-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Risk Score Calculation](#-risk-score-calculation)
- [Dashboard Preview](#-dashboard-preview)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🎯 Core Features
- **Real-time Driver Risk Score (0-100)** - Lower score = higher risk
- **Hybrid IoT System** - Real hardware (MPU6050) + Simulated sensors (Speed/RPM/GPS)
- **Live Dashboard** - Professional React-based UI with real-time updates
- **Driver Insights** - Weekly/monthly reports with personalized safety tips
- **Admin Panel** - Monitor multiple drivers with leaderboard and filtering
- **Event Detection** - Overspeed, sudden braking, aggressive acceleration, sharp turns
- **Cloud Storage** - Firebase/MongoDB integration (optional in-memory storage)

### 🎨 UI/UX Features
- **World-class Design** - Navy Blue (#1A1F71) & Teal (#00BFA6) theme
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes
- **Real-time Animations** - Smooth transitions and live updates
- **Interactive Charts** - Speed trends, risk history, behavior analysis
- **GPS Route Simulation** - Pre-defined coordinates for demo

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   ESP8266 +     │  ──────► Read MPU6050 (Real)
│   MPU6050       │           Simulate Speed/RPM/GPS
└────────┬────────┘           Send JSON every 2s
         │
         │ Wi-Fi
         ▼
┌─────────────────┐
│  Flask Backend  │  ──────► Calculate Risk Score
│  (Python)       │           Store in Firebase/MongoDB
└────────┬────────┘           Provide REST API
         │
         │ HTTP
         ▼
┌─────────────────┐
│ React Dashboard │  ──────► Real-time Metrics
│  (Frontend)     │           Charts & Visualizations
└─────────────────┘           Driver Insights & Admin Panel
```

---

## 🔧 Hardware Requirements

### Required (Real Hardware)
| Component | Quantity | Description |
|-----------|----------|-------------|
| **ESP8266 NodeMCU** | 1 | Wi-Fi microcontroller |
| **MPU6050** | 1 | 6-axis accelerometer + gyroscope |
| **Jumper Wires** | 4 | For I2C connection |
| **USB Cable** | 1 | For power & programming |

### Connections (I2C)
```
ESP8266 NodeMCU  ↔  MPU6050
───────────────────────────
    3.3V         →   VCC
    GND          →   GND
    D2 (GPIO4)   →   SDA
    D1 (GPIO5)   →   SCL
```

### Simulated Hardware
- **Speed** - Random variation (0-120 km/h)
- **RPM** - Calculated from speed (800-5000)
- **GPS** - Pre-defined Bangalore coordinates
- **Throttle** - Mapped from speed

---

## 💻 Software Stack

### Firmware
- **Arduino IDE** (1.8.19 or newer)
- **ESP8266 Board Package** (3.0.0+)
- **Libraries:**
  - `ESP8266WiFi`
  - `ESP8266HTTPClient`
  - `Wire`
  - `MPU6050` (by Electronic Cats)
  - `ArduinoJson` (6.x)

### Backend
- **Python** (3.8+)
- **Flask** (3.0.0)
- **Flask-CORS** (4.0.0)
- **Firebase Admin SDK** (6.3.0) - Optional

### Frontend
- **Node.js** (16.x or 18.x)
- **React** (18.2.0)
- **Recharts** (2.10.3) - Charts
- **Lucide React** (0.292.0) - Icons
- **Axios** (1.6.2) - HTTP client
- **React Circular Progressbar** (2.1.0) - Gauge

---

## 📁 Project Structure

```
DriveIQ/
│
├── firmware/
│   └── esp8266_driver_monitor/
│       └── esp8266_driver_monitor.ino    # ESP8266 Arduino code
│
├── backend/
│   ├── app.py                             # Flask server
│   ├── requirements.txt                   # Python dependencies
│   ├── firebase-setup.md                  # Firebase instructions
│   └── firebase-credentials.json          # (Your Firebase key - gitignored)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js               # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── DriverInsights.js          # Insights page
│   │   │   ├── DriverInsights.css
│   │   │   ├── AdminPanel.js              # Admin panel
│   │   │   └── AdminPanel.css
│   │   ├── App.js                         # Main app component
│   │   ├── App.css                        # Global styles
│   │   ├── index.js                       # Entry point
│   │   └── index.css
│   └── package.json                       # Node dependencies
│
└── README.md                              # This file
```

---

## 🚀 Installation & Setup

### 1️⃣ Hardware Setup

1. **Wire the MPU6050** to ESP8266 as shown in [Hardware Requirements](#-hardware-requirements)
2. **Connect ESP8266** to your computer via USB
3. Verify connections and power up

### 2️⃣ Firmware Setup (ESP8266)

1. **Install Arduino IDE** from [arduino.cc](https://www.arduino.cc/en/software)

2. **Add ESP8266 Board:**
   - File → Preferences → Additional Board Manager URLs
   - Add: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Tools → Board → Boards Manager → Search "ESP8266" → Install

3. **Install Libraries:**
   - Sketch → Include Library → Manage Libraries
   - Install: `MPU6050` (by Electronic Cats), `ArduinoJson`

4. **Configure & Upload:**
   ```cpp
   // Edit these in esp8266_driver_monitor.ino:
   const char* WIFI_SSID = "YOUR_WIFI_NAME";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* BACKEND_URL = "http://YOUR_PC_IP:5000/api/vehicle-data";
   ```
   
5. **Upload Code:**
   - Tools → Board → NodeMCU 1.0 (ESP-12E Module)
   - Tools → Port → (Select your COM port)
   - Click Upload (➔)

6. **Open Serial Monitor** (Ctrl+Shift+M) to see output

### 3️⃣ Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Firebase Setup (Optional - see `backend/firebase-setup.md`):**
   - Create Firebase project
   - Download `firebase-credentials.json`
   - Place in `backend/` folder
   
   **OR** skip Firebase - backend will use in-memory storage

5. **Run backend:**
   ```bash
   python app.py
   ```
   
   Server will start on `http://0.0.0.0:5000`

### 4️⃣ Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update backend URL (if needed):**
   ```javascript
   // In src/App.js, line 10:
   const BACKEND_URL = 'http://localhost:5000';
   // Change to your backend IP if running on different machine
   ```

4. **Start development server:**
   ```bash
   npm start
   ```
   
   Dashboard will open at `http://localhost:3000`

---

## 🎯 Usage

### Running the Complete System

1. **Power up ESP8266** - It will connect to Wi-Fi and start sending data
2. **Backend running** - Should show: `✓ Data received and processed`
3. **Open Dashboard** - Visit `http://localhost:3000`
4. **View Real-time Data** - Dashboard updates every 2 seconds

### Dashboard Navigation

#### 🏠 **Main Dashboard**
- **Large Circular Gauge** - Current driver risk score
- **Metrics Cards** - Speed, RPM, Risk Events, Avg Speed
- **Speed Chart** - Real-time speed trend
- **Risk History** - Bar chart of risk scores
- **Event Breakdown** - Count of risky events
- **GPS Location** - Current coordinates
- **Live Status** - Active risk indicators

#### 📊 **Driver Insights**
- **Trend Analysis** - Improving/Declining/Stable indicator
- **Summary Cards** - Avg risk score, distance, events
- **Risk Score Trend** - Area chart over time
- **Behavior Radar** - Multi-dimensional analysis
- **Safety Tips** - Personalized recommendations
- **Event Summary** - Detailed breakdown with progress bars

#### 👥 **Admin Panel**
- **Driver Statistics** - Total drivers, safe vs risky
- **Drivers Table** - All drivers with filtering
- **Search & Filter** - By name, vehicle, risk level
- **Leaderboard** - Top 5 safest drivers with medals

### Theme Toggle
- Click **Moon/Sun** icon in header to switch dark/light mode

---

## 📐 Risk Score Calculation

### Formula
```
Risk Score = 100 - (Penalties)

Penalties:
- Overspeed: 25%
- Sudden Braking: 20%
- Aggressive Acceleration: 20%
- Sharp Turns: 15%
- Night Driving (10 PM - 5 AM): 20%

Final Score = Clamped between 0-100
```

### Risk Levels
| Score Range | Risk Level | Color | Description |
|-------------|------------|-------|-------------|
| 80-100 | **Low** | 🟢 Green | Excellent driving |
| 60-79 | **Medium** | 🟡 Yellow | Moderate risk |
| 0-59 | **High** | 🔴 Red | Dangerous driving |

### Detection Thresholds (MPU6050)
| Event | Threshold | MPU6050 Sensor |
|-------|-----------|----------------|
| **Aggressive Acceleration** | > 15,000 | Accelerometer X-axis |
| **Sudden Braking** | < -15,000 | Accelerometer X-axis |
| **Sharp Turn** | > 20,000 | Gyroscope Z-axis |
| **Overspeed** | > 80 km/h | Simulated |

---

## 🖼️ Dashboard Preview

### Main Dashboard
- Circular risk gauge with dynamic colors
- Real-time metrics with icons
- Interactive line & bar charts
- Event indicators with alerts

### Driver Insights
- Trend analysis with improvement tracking
- Radar chart for behavior analysis
- Personalized safety tips
- Progress bars for event metrics

### Admin Panel
- Searchable drivers table
- Risk level filtering
- Medal-based leaderboard
- Responsive grid layout

**Colors:**
- Primary Navy: `#1A1F71`
- Teal Accent: `#00BFA6`
- Alert Red: `#FF4C4C`
- Success Green: `#10B981`
- Warning Yellow: `#F59E0B`

---

## 🌐 Deployment

### Backend (Flask)

#### Option 1: Local Network
- Run on your PC: `python app.py`
- Access via IP: `http://YOUR_PC_IP:5000`
- Update ESP8266 & frontend URLs

#### Option 2: Cloud (Heroku/Railway)
1. Add `Procfile`:
   ```
   web: gunicorn app:app
   ```
2. Push to Git repository
3. Deploy on [Railway](https://railway.app/) or [Heroku](https://www.heroku.com/)
4. Update ESP8266 & frontend URLs

### Frontend (React)

#### Option 1: Development
```bash
npm start  # Runs on localhost:3000
```

#### Option 2: Production Build
```bash
npm run build  # Creates optimized build/
```

Deploy `build/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `build/` folder
- **GitHub Pages**: Follow [React deployment guide](https://create-react-app.dev/docs/deployment/)

---

## 🛠️ Troubleshooting

### ESP8266 Issues

❌ **MPU6050 connection failed**
- Check wiring (SDA/SCL)
- Verify 3.3V power (not 5V)
- Try different I2C address: `mpu.setAddr(MPU6050_ADDRESS_AD0_HIGH)`

❌ **WiFi not connecting**
- Verify SSID/password
- Check 2.4GHz network (ESP8266 doesn't support 5GHz)
- Increase timeout: `wifiAttempts < 50`

❌ **HTTP Error -1 or -11**
- Backend not running or wrong URL
- Check firewall settings
- Verify PC and ESP8266 on same network

### Backend Issues

❌ **Firebase initialization failed**
- Check `firebase-credentials.json` exists
- Verify file is valid JSON
- Ensure Firestore is enabled in Firebase Console

❌ **CORS errors**
- Flask-CORS is installed: `pip install flask-cors`
- Backend URL matches in frontend

### Frontend Issues

❌ **npm install fails**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, retry
- Try: `npm install --legacy-peer-deps`

❌ **Dashboard shows "Offline"**
- Backend must be running
- Check `BACKEND_URL` in `App.js`
- Verify network connectivity

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **SMS/Email Alerts** - Notify on high-risk events
- [ ] **ML/AI Predictions** - Accident probability forecasting
- [ ] **Real GPS Module** - NEO-6M integration
- [ ] **Mobile App** - React Native version
- [ ] **Multi-driver Support** - Unique device IDs
- [ ] **Voice Alerts** - Audio warnings in vehicle
- [ ] **OBD-II Integration** - Real speed/RPM from vehicle
- [ ] **Trip History** - Detailed route playback
- [ ] **Gamification** - Achievements & challenges
- [ ] **Insurance Integration** - Lower premiums for safe drivers

### Hardware Upgrades
- Add **GPS Module** (NEO-6M)
- Add **GSM Module** (SIM800L) for SMS
- Add **SD Card** for offline logging
- Add **Buzzer** for in-vehicle alerts
- Add **OLED Display** for real-time feedback

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

## 📧 Contact & Support

**Developer:** DriveIQ Team  
**Project Repository:** [GitHub](#) *(Add your repo link)*  
**Issues:** [Report a bug](#) *(Add issue tracker)*

---

<div align="center">

**Made with ❤️ for safer roads**

⭐ Star this project if you find it useful!

</div>
