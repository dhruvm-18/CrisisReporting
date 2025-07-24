import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import L from 'leaflet';

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
  if (severity === 'Severe') return redIcon;
  if (severity === 'Moderate') return orangeIcon;
  return greenIcon;
};

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get('http://localhost:5000/api/reports');
    setReports(res.data);
  };

  const filteredReports = filter === 'All' ? reports : reports.filter(r => r.severity === filter);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl>
          <InputLabel id="severity-filter-label">Severity</InputLabel>
          <Select
            labelId="severity-filter-label"
            value={filter}
            label="Severity"
            onChange={e => setFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Severe">Severe</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Minor">Minor</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2">Showing {filteredReports.length} reports</Typography>
      </Box>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={4}
        style={{ height: 400, borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredReports.map(report => (
          <Marker
            key={report.id}
            position={[parseFloat(report.lat), parseFloat(report.lng)]}
            icon={getIcon(report.severity)}
          >
            <Popup>
              <Typography variant="subtitle2">{report.severity}</Typography>
              <Typography variant="body2">{report.description}</Typography>
              {report.address && <Typography variant="caption">{report.address}</Typography>}
              {report.image_url && (
                <Box mt={1}>
                  <img src={report.image_url} alt="Report" style={{ maxWidth: 200, borderRadius: 8 }} />
                </Box>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapView; 