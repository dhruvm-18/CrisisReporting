import React, { useState, useRef } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Select, InputLabel, FormControl, CircularProgress, Alert } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const severityOptions = [
  { value: 'Severe', label: 'Severe' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Minor', label: 'Minor' },
];

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      // Reverse geocode
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => setAddress(data.display_name || ''));
    },
  });
  return position ? <Marker position={position} /> : null;
}

const ReportForm = ({ onReportSubmitted }) => {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const mapRef = useRef();

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 14);
        }
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => setAddress(data.display_name || ''));
      },
      () => setError('Unable to retrieve your location.')
    );
  };

  const handleDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!description || !position) {
      setError('Description and location are required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('description', description);
    formData.append('lat', position[0]);
    formData.append('lng', position[1]);
    formData.append('address', address);
    if (severity) formData.append('severity', severity);
    if (image) formData.append('image', image);
    try {
      const res = await axios.post('http://localhost:5000/api/reports', formData);
      setSuccess('Report submitted!');
      setDescription('');
      setSeverity('');
      setPosition(null);
      setAddress('');
      setImage(null);
      if (onReportSubmitted) onReportSubmitted(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Report a Disaster</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        multiline
        minRows={2}
      />
      <FormControl fullWidth>
        <InputLabel id="severity-label">Severity</InputLabel>
        <Select
          labelId="severity-label"
          value={severity}
          label="Severity"
          onChange={e => setSeverity(e.target.value)}
        >
          {severityOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>Select Location:</Typography>
        <Button variant="outlined" onClick={handleCurrentLocation} sx={{ mb: 1 }}>Use My Current Location</Button>
        <MapContainer
          center={position || [20.5937, 78.9629]}
          zoom={position ? 14 : 4}
          style={{ height: 250, borderRadius: 8 }}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
        </MapContainer>
        {address && <Typography variant="caption">{address}</Typography>}
      </Box>
      <Dropzone onDrop={handleDrop} accept={{'image/*': []}} maxFiles={1}>
        {({ getRootProps, getInputProps }) => (
          <Box {...getRootProps()} sx={{ border: '2px dashed #1976d2', p: 2, borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {image ? (
              <Typography variant="body2">{image.name}</Typography>
            ) : (
              <Typography variant="body2">Drag & drop an image here, or click to select</Typography>
            )}
          </Box>
        )}
      </Dropzone>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit Report'}
      </Button>
    </Box>
  );
};

export default ReportForm; 