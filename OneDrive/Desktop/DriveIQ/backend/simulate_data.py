#!/usr/bin/env python3
"""
DriveIQ Data Simulator
Simulates ESP8266 sending vehicle data to backend
Use this to test the system without hardware
"""

import requests
import random
import time
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:5000/api/vehicle-data"
SEND_INTERVAL = 2  # seconds

def generate_vehicle_data():
    """Generate realistic simulated vehicle data"""
    
    # Simulate different driving scenarios
    scenarios = ['normal', 'aggressive', 'safe']
    scenario = random.choice(scenarios)
    
    if scenario == 'aggressive':
        speed = random.uniform(80, 110)
        overspeed = 1
        braking = 1 if random.random() > 0.7 else 0
        aggressive_accel = 1 if random.random() > 0.6 else 0
        sharp_turn = 1 if random.random() > 0.65 else 0
    elif scenario == 'safe':
        speed = random.uniform(40, 70)
        overspeed = 0
        braking = 0
        aggressive_accel = 0
        sharp_turn = 0
    else:  # normal
        speed = random.uniform(55, 85)
        overspeed = 1 if speed > 80 else 0
        braking = 1 if random.random() > 0.9 else 0
        aggressive_accel = 1 if random.random() > 0.87 else 0
        sharp_turn = 1 if random.random() > 0.85 else 0
    
    # Calculate RPM based on speed
    rpm = int(speed * 30 + random.uniform(-100, 100))
    rpm = max(800, min(5000, rpm))
    
    # GPS coordinates (Bangalore area)
    lat = 12.9716 + random.uniform(-0.02, 0.02)
    lon = 77.5946 + random.uniform(-0.02, 0.02)
    
    data = {
        "device_id": "SIMULATOR_001",
        "speed": round(speed, 1),
        "rpm": rpm,
        "throttle": int(speed / 120 * 100),
        "acceleration": round(random.uniform(-2.5, 2.5), 2),
        "braking": braking,
        "sharp_turn": sharp_turn,
        "overspeed": overspeed,
        "aggressive_accel": aggressive_accel,
        "latitude": round(lat, 6),
        "longitude": round(lon, 6),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    return data, scenario

def main():
    print("\n" + "="*60)
    print("DriveIQ Data Simulator")
    print("="*60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Send Interval: {SEND_INTERVAL} seconds")
    print("="*60 + "\n")
    print("🚀 Starting simulation... (Press Ctrl+C to stop)\n")
    
    count = 0
    
    try:
        while True:
            count += 1
            data, scenario = generate_vehicle_data()
            
            try:
                response = requests.post(BACKEND_URL, json=data, timeout=5)
                
                if response.status_code == 200:
                    result = response.json()
                    risk_score = result.get('risk_score', 'N/A')
                    risk_level = result.get('risk_level', 'N/A')
                    
                    # Color output based on risk
                    if isinstance(risk_score, (int, float)) and risk_score >= 80:
                        status = "✓ SAFE"
                    elif isinstance(risk_score, (int, float)) and risk_score >= 60:
                        status = "⚠ MODERATE"
                    else:
                        status = "⛔ RISKY"
                    
                    print(f"[{count:04d}] {status} | Score: {risk_score} | "
                          f"Speed: {data['speed']:.1f} km/h | "
                          f"Scenario: {scenario.upper()}")
                else:
                    print(f"[{count:04d}] ✗ HTTP {response.status_code}")
                    
            except requests.exceptions.ConnectionError:
                print(f"[{count:04d}] ✗ Connection Error - Is backend running?")
            except requests.exceptions.Timeout:
                print(f"[{count:04d}] ✗ Timeout - Backend not responding")
            except Exception as e:
                print(f"[{count:04d}] ✗ Error: {e}")
            
            time.sleep(SEND_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n" + "="*60)
        print(f"Simulation stopped. Total data points sent: {count}")
        print("="*60 + "\n")

if __name__ == "__main__":
    main()
