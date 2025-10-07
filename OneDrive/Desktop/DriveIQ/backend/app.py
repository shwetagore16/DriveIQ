from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore
import os
from collections import defaultdict
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# ========== FIREBASE CONFIGURATION ==========
# Initialize Firebase (use your own credentials)
try:
    if not firebase_admin._apps:
        # Option 1: Use environment variable for credentials
        if os.path.exists('firebase-credentials.json'):
            cred = credentials.Certificate('firebase-credentials.json')
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✓ Firebase initialized successfully!")
        else:
            print("⚠️  Firebase credentials not found. Using in-memory storage.")
            db = None
except Exception as e:
    print(f"⚠️  Firebase initialization failed: {e}")
    db = None

# In-memory storage (fallback if Firebase not configured)
in_memory_data = []
driver_stats = {
    'total_trips': 0,
    'total_distance': 0,
    'risk_events': defaultdict(int)
}

# ========== RISK SCORE CALCULATION ==========
def calculate_risk_score(data):
    """
    Calculate driver risk score (0-100)
    Lower score = Higher risk
    Higher score = Safer driving
    
    Weights:
    - Overspeed: 25%
    - Sudden Braking: 20%
    - Aggressive Acceleration: 20%
    - Sharp Turns: 15%
    - Night Driving: 20%
    """
    score = 100.0
    
    # Overspeed penalty
    overspeed_penalty = data.get('overspeed', 0) * 25
    
    # Sudden braking penalty
    braking_penalty = data.get('braking', 0) * 20
    
    # Aggressive acceleration penalty
    accel_penalty = data.get('aggressive_accel', 0) * 20
    
    # Sharp turn penalty
    turn_penalty = data.get('sharp_turn', 0) * 15
    
    # Night driving penalty (between 10 PM and 5 AM)
    try:
        timestamp = datetime.fromisoformat(data.get('timestamp', '').replace('Z', '+00:00'))
        hour = timestamp.hour
        night_penalty = 20 if (hour >= 22 or hour <= 5) else 0
    except:
        night_penalty = 0
    
    # Calculate final score
    score -= (overspeed_penalty + braking_penalty + accel_penalty + turn_penalty + night_penalty)
    score = max(0, min(100, score))  # Clamp between 0-100
    
    # Determine risk level
    if score >= 80:
        risk_level = "Low"
    elif score >= 60:
        risk_level = "Medium"
    else:
        risk_level = "High"
    
    return {
        'score': round(score, 2),
        'risk_level': risk_level,
        'penalties': {
            'overspeed': overspeed_penalty,
            'braking': braking_penalty,
            'acceleration': accel_penalty,
            'sharp_turn': turn_penalty,
            'night_driving': night_penalty
        }
    }

# ========== API ENDPOINTS ==========

@app.route('/api/vehicle-data', methods=['POST'])
def receive_vehicle_data():
    """Receive data from ESP8266"""
    try:
        data = request.json
        
        # Add server timestamp
        data['server_timestamp'] = datetime.utcnow().isoformat()
        
        # Calculate risk score
        risk_data = calculate_risk_score(data)
        data['risk_score'] = risk_data['score']
        data['risk_level'] = risk_data['risk_level']
        data['penalties'] = risk_data['penalties']
        
        # Store in Firebase or in-memory
        if db:
            try:
                db.collection('vehicle_data').add(data)
                print(f"✓ Data stored in Firebase - Risk Score: {risk_data['score']}")
            except Exception as e:
                print(f"✗ Firebase write failed: {e}")
                in_memory_data.append(data)
        else:
            in_memory_data.append(data)
            # Keep only last 1000 records in memory
            if len(in_memory_data) > 1000:
                in_memory_data.pop(0)
        
        # Update stats
        driver_stats['total_trips'] += 1
        if data.get('overspeed'): driver_stats['risk_events']['overspeed'] += 1
        if data.get('braking'): driver_stats['risk_events']['braking'] += 1
        if data.get('aggressive_accel'): driver_stats['risk_events']['aggressive_accel'] += 1
        if data.get('sharp_turn'): driver_stats['risk_events']['sharp_turn'] += 1
        
        return jsonify({
            'status': 'success',
            'message': 'Data received and processed',
            'risk_score': risk_data['score'],
            'risk_level': risk_data['risk_level']
        }), 200
        
    except Exception as e:
        print(f"✗ Error processing data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/get-data', methods=['GET'])
def get_data():
    """Get latest vehicle data for dashboard"""
    try:
        limit = int(request.args.get('limit', 100))
        
        if db:
            # Fetch from Firebase
            docs = db.collection('vehicle_data').order_by('server_timestamp', direction=firestore.Query.DESCENDING).limit(limit).stream()
            data = [doc.to_dict() for doc in docs]
        else:
            # Fetch from in-memory storage
            data = in_memory_data[-limit:]
            data.reverse()
        
        return jsonify({
            'status': 'success',
            'count': len(data),
            'data': data
        }), 200
        
    except Exception as e:
        print(f"✗ Error fetching data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/latest', methods=['GET'])
def get_latest():
    """Get the most recent vehicle data point"""
    try:
        if db:
            docs = db.collection('vehicle_data').order_by('server_timestamp', direction=firestore.Query.DESCENDING).limit(1).stream()
            data = [doc.to_dict() for doc in docs]
            latest = data[0] if data else None
        else:
            latest = in_memory_data[-1] if in_memory_data else None
        
        if latest:
            return jsonify({
                'status': 'success',
                'data': latest
            }), 200
        else:
            return jsonify({
                'status': 'success',
                'data': None,
                'message': 'No data available'
            }), 200
            
    except Exception as e:
        print(f"✗ Error fetching latest data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get driving statistics and analytics"""
    try:
        if db:
            # Fetch last 24 hours of data
            yesterday = datetime.utcnow() - timedelta(hours=24)
            docs = db.collection('vehicle_data').where('server_timestamp', '>=', yesterday.isoformat()).stream()
            data = [doc.to_dict() for doc in docs]
        else:
            data = in_memory_data
        
        if not data:
            return jsonify({
                'status': 'success',
                'statistics': {
                    'average_speed': 0,
                    'average_risk_score': 0,
                    'total_events': 0,
                    'events_breakdown': {},
                    'total_data_points': 0
                }
            }), 200
        
        # Calculate statistics
        total_speed = sum(d.get('speed', 0) for d in data)
        total_risk = sum(d.get('risk_score', 0) for d in data)
        avg_speed = total_speed / len(data) if data else 0
        avg_risk = total_risk / len(data) if data else 0
        
        events = {
            'overspeed': sum(1 for d in data if d.get('overspeed')),
            'braking': sum(1 for d in data if d.get('braking')),
            'aggressive_accel': sum(1 for d in data if d.get('aggressive_accel')),
            'sharp_turn': sum(1 for d in data if d.get('sharp_turn'))
        }
        
        total_events = sum(events.values())
        
        return jsonify({
            'status': 'success',
            'statistics': {
                'average_speed': round(avg_speed, 2),
                'average_risk_score': round(avg_risk, 2),
                'total_events': total_events,
                'events_breakdown': events,
                'total_data_points': len(data),
                'max_speed': max(d.get('speed', 0) for d in data),
                'min_risk_score': min(d.get('risk_score', 100) for d in data),
                'max_risk_score': max(d.get('risk_score', 0) for d in data)
            }
        }), 200
        
    except Exception as e:
        print(f"✗ Error calculating statistics: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/risk-history', methods=['GET'])
def get_risk_history():
    """Get risk score history for charts"""
    try:
        hours = int(request.args.get('hours', 24))
        
        if db:
            since = datetime.utcnow() - timedelta(hours=hours)
            docs = db.collection('vehicle_data').where('server_timestamp', '>=', since.isoformat()).order_by('server_timestamp').stream()
            data = [doc.to_dict() for doc in docs]
        else:
            data = in_memory_data[-100:]  # Last 100 points
        
        history = [
            {
                'timestamp': d.get('server_timestamp', d.get('timestamp')),
                'risk_score': d.get('risk_score', 0),
                'speed': d.get('speed', 0)
            }
            for d in data
        ]
        
        return jsonify({
            'status': 'success',
            'history': history
        }), 200
        
    except Exception as e:
        print(f"✗ Error fetching risk history: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'firebase_connected': db is not None,
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ========== MAIN ==========
if __name__ == '__main__':
    print("\n" + "="*50)
    print("DriveIQ Backend Server")
    print("="*50)
    print(f"Firebase Status: {'✓ Connected' if db else '✗ Using in-memory storage'}")
    print("Starting server on http://0.0.0.0:5000")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
