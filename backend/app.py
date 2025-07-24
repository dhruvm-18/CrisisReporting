from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import uuid
import requests
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
DATA_FILE = 'data.json'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def load_reports():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except Exception:
            return []

def save_reports(reports):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)

def classify_severity(description):
    # Simple rule-based severity classification
    desc = description.lower()
    if any(word in desc for word in ['death', 'fatal', 'collapsed', 'major', 'catastrophic', 'explosion']):
        return 'Severe'
    elif any(word in desc for word in ['injury', 'damaged', 'flood', 'fire', 'earthquake', 'moderate']):
        return 'Moderate'
    else:
        return 'Minor'

def is_valid_lat_lng(lat, lng):
    try:
        lat_val = float(lat)
        lng_val = float(lng)
        return -90 <= lat_val <= 90 and -180 <= lng_val <= 180
    except (TypeError, ValueError):
        return False

@app.route('/api/reports', methods=['GET'])
def get_reports():
    reports = load_reports()
    return jsonify(reports[::-1])

@app.route('/api/reports', methods=['POST'])
def create_report():
    data = request.form
    emergency_type = data.get('emergencyType')
    severity = data.get('severity')
    location = data.get('location')
    description = data.get('description')
    phone = data.get('phone')
    image = request.files.get('photo')
    image_url = None
    address = location
    lat = None
    lng = None
    # Try to extract lat/lng from location string
    if location and 'Lat:' in location and 'Lng:' in location:
        match = re.match(r'Lat: ([\d.\-]+), Lng: ([\d.\-]+)', location)
        if match:
            lat = match.group(1)
            lng = match.group(2)
    # If not, try to geocode the address
    if (not lat or not lng) and location:
        try:
            resp = requests.get('https://nominatim.openstreetmap.org/search', params={
                'q': location,
                'format': 'json',
                'limit': 1
            }, headers={'User-Agent': 'DisasterReportingApp/1.0'})
            geo = resp.json()
            if geo and len(geo) > 0:
                lat = geo[0]['lat']
                lng = geo[0]['lon']
        except Exception:
            pass
    if not (emergency_type and severity and location and description):
        return jsonify({'error': 'Invalid or missing data'}), 400
    if image and image.filename:
        filename = f"{uuid.uuid4().hex}_{secure_filename(image.filename)}"
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        image_url = f'/api/uploads/{filename}'
    report = {
        'id': uuid.uuid4().hex,
        'emergencyType': emergency_type,
        'severity': severity,
        'address': address,
        'lat': lat,
        'lng': lng,
        'description': description,
        'phone': phone,
        'image_url': image_url,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'status': 'Monitoring'
    }
    reports = load_reports()
    reports.append(report)
    save_reports(reports)
    return jsonify(report), 201

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    reports = load_reports()
    for report in reports:
        if report['id'] == report_id:
            return jsonify(report)
    return jsonify({'error': 'Report not found'}), 404

@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    reports = load_reports()
    new_reports = [r for r in reports if r['id'] != report_id]
    if len(new_reports) == len(reports):
        return jsonify({'error': 'Report not found'}), 404
    save_reports(new_reports)
    return jsonify({'success': True})

@app.route('/api/severity', methods=['POST'])
def api_severity():
    data = request.get_json()
    description = data.get('description', '')
    severity = classify_severity(description)
    return jsonify({'severity': severity})

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True) 