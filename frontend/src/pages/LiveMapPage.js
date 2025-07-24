import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Stack, Card, CardContent, Chip, Button, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="red" stroke="black" stroke-width="2" d="M16 1C8 1 1 8 1 16c0 10 15 30 15 30s15-20 15-30C31 8 24 1 16 1z"/><circle fill="white" stroke="black" stroke-width="2" cx="16" cy="16" r="6"/></svg>',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});
const orangeIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="orange" stroke="black" stroke-width="2" d="M16 1C8 1 1 8 1 16c0 10 15 30 15 30s15-20 15-30C31 8 24 1 16 1z"/><circle fill="white" stroke="black" stroke-width="2" cx="16" cy="16" r="6"/></svg>',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});
const greenIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="green" stroke="black" stroke-width="2" d="M16 1C8 1 1 8 1 16c0 10 15 30 15 30s15-20 15-30C31 8 24 1 16 1z"/><circle fill="white" stroke="black" stroke-width="2" cx="16" cy="16" r="6"/></svg>',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const getIcon = (severity) => {
  if (severity === 'Critical' || severity === 'Severe') return redIcon;
  if (severity === 'High' || severity === 'Moderate') return orangeIcon;
  return greenIcon;
};

const severityColor = {
  'Low': 'success',
  'Medium': 'warning',
  'High': 'error',
  'Critical': 'error',
  'Severe': 'error',
  'Moderate': 'warning',
};

function getStatus(report) {
  const now = new Date();
  const ts = new Date(report.timestamp || report.time || Date.now());
  const diff = (now - ts) / 1000; // seconds
  if (diff < 5) return 'Monitoring';
  if (diff < 10) return 'Verified';
  if (diff < 15) return 'Responding';
  return 'Resolved';
}

const statusColor = {
  'Monitoring': 'default',
  'Verified': 'info',
  'Responding': 'warning',
  'Resolved': 'success',
};
const statusBg = {
  'Monitoring': '#f5f5f5',
  'Verified': '#e3f2fd',
  'Responding': '#fff3e0',
  'Resolved': '#e8f5e9',
};

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

const LiveMapPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get('http://localhost:5000/api/reports');
    setReports(res.data);
  };

  // Collect all valid lat/lng positions
  const positions = reports
    .map(r => {
      let lat = r.lat ? parseFloat(r.lat) : null;
      let lng = r.lng ? parseFloat(r.lng) : null;
      if ((!lat || !lng) && r.address && r.address.includes('Lat:')) {
        const match = r.address.match(/Lat: ([\d.\-]+), Lng: ([\d.\-]+)/);
        if (match) {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
        }
      }
      return lat && lng ? [lat, lng] : null;
    })
    .filter(Boolean);

  const mapCenter = positions.length > 0 ? positions[0] : [20.5937, 78.9629];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, mb: 6, height: { xs: 'auto', md: 540 } }}>
      <Typography variant="h4" fontWeight={700} mb={2} align="center">Live Emergency Feed</Typography>
      <Typography color="text.secondary" align="center" mb={4}>
        Real-time updates from emergency reports across your region
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ height: { xs: 'auto', md: 500 } }}>
        {/* Interactive Map */}
        <Paper elevation={2} sx={{ flex: 1, p: 0, height: 500, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', bgcolor: '#f7f8fa', overflow: 'hidden' }}>
          <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitBounds positions={positions} />
            {reports.map(report => {
              let lat = report.lat ? parseFloat(report.lat) : null;
              let lng = report.lng ? parseFloat(report.lng) : null;
              if ((!lat || !lng) && report.address && report.address.includes('Lat:')) {
                const match = report.address.match(/Lat: ([\d.\-]+), Lng: ([\d.\-]+)/);
                if (match) {
                  lat = parseFloat(match[1]);
                  lng = parseFloat(match[2]);
                }
              }
              if (lat && lng) {
                return (
                  <Marker key={report.id} position={[lat, lng]} icon={getIcon(report.severity)}>
                    <Popup>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Chip
                          size="small"
                          label={getStatus(report)}
                          color={statusColor[getStatus(report)]}
                          sx={{ bgcolor: statusBg[getStatus(report)], fontWeight: 600, fontSize: 15, borderRadius: 2 }}
                        />
                        <Typography variant="subtitle2" fontWeight={700}>{report.emergencyType || report.type}</Typography>
                      </Stack>
                      <Typography variant="body2">{report.description}</Typography>
                      <Typography variant="caption">{report.address}</Typography>
                      {report.image_url && (
                        <Box mt={1}>
                          <img src={report.image_url} alt="Report" style={{ maxWidth: 200, borderRadius: 8 }} />
                        </Box>
                      )}
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </Paper>
        {/* Recent Reports */}
        <Box flex={1.2} sx={{ height: 500, overflowY: 'auto' }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Recent Reports</Typography>
          <Stack spacing={2}>
            {reports.map(report => (
              <Card key={report.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Chip
                      size="small"
                      label={getStatus(report)}
                      color={statusColor[getStatus(report)]}
                      sx={{ bgcolor: statusBg[getStatus(report)], fontWeight: 600, fontSize: 15, borderRadius: 2 }}
                    />
                    <Chip size="small" label={report.emergencyType || report.type} color={severityColor[report.severity]} icon={<ErrorIcon />} />
                    <Typography variant="subtitle2" fontWeight={700}>{report.id}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2">{report.address}</Typography>
                    {report.time && <><AccessTimeIcon color="action" fontSize="small" sx={{ ml: 2 }} />
                    <Typography variant="body2">{report.time}</Typography></>}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={1}>{report.description}</Typography>
                  {report.phone && <Typography variant="caption" color="text.secondary">Contact: {report.phone}</Typography>}
                  {report.image_url && (
                    <Box mt={1}>
                      <img src={report.image_url} alt="Report" style={{ maxWidth: 120, borderRadius: 8 }} />
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Button size="small" variant="text">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LiveMapPage; 