import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Stack, Alert, ToggleButton, ToggleButtonGroup, InputAdornment, Avatar, Select, FormControl, InputLabel, CircularProgress, Divider, MenuItem, Autocomplete } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RoomIcon from '@mui/icons-material/Room';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhoneIcon from '@mui/icons-material/Phone';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PublicIcon from '@mui/icons-material/Public';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { motion } from 'framer-motion';

const emergencyTypes = [
  { value: 'Fire', label: 'Fire', icon: <LocalFireDepartmentIcon color="error" /> },
  { value: 'Flood', label: 'Flood', icon: <WaterDropIcon color="primary" /> },
  { value: 'Earthquake', label: 'Earthquake', icon: <PublicIcon color="success" /> },
  { value: 'Accident', label: 'Accident', icon: <DirectionsCarIcon color="warning" /> },
  { value: 'Medical', label: 'Medical', icon: <LocalHospitalIcon color="success" /> },
  { value: 'Crime', label: 'Crime', icon: <SecurityIcon color="secondary" /> },
  { value: 'Other', label: 'Other', icon: <HelpOutlineIcon color="action" /> },
];

const severityLevels = [
  { value: 'Low', color: 'success', label: 'Low' },
  { value: 'Medium', color: 'warning', label: 'Medium' },
  { value: 'High', color: 'error', label: 'High' },
  { value: 'Critical', color: 'error', label: 'Critical', dot: true },
];

const ReportFormPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [severity, setSeverity] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => setError('Unable to retrieve your location.')
    );
  };

  const handleLocationInput = async (e, value) => {
    setLocation(value);
    setLat('');
    setLng('');
    if (value && value.length > 2) {
      setLocationLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5`);
        const data = await res.json();
        setLocationOptions(data);
      } catch {
        setLocationOptions([]);
      } finally {
        setLocationLoading(false);
      }
    } else {
      setLocationOptions([]);
    }
  };

  const handleLocationSelect = (e, value) => {
    if (value) {
      setLocation(value.display_name);
      setLat(value.lat);
      setLng(value.lon);
    }
  };

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setPhoto(acceptedFiles[0]);
      setPhotoPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!emergencyType || !severity || !location || !description) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('emergencyType', emergencyType);
    formData.append('severity', severity);
    formData.append('location', location);
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('description', description);
    formData.append('phone', phone);
    if (photo) formData.append('photo', photo);
    try {
      await axios.post('http://localhost:5000/api/reports', formData);
      setSuccess('Report submitted!');
      setEmergencyType('');
      setSeverity('');
      setLocation('');
      setLat('');
      setLng('');
      setDescription('');
      setPhone('');
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      setError('Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <WarningAmberIcon color="error" fontSize="large" />
              <Typography variant="h5" fontWeight={700}>Disaster Reporting Form</Typography>
            </Stack>
            <Typography color="text.secondary" mb={1}>
              Help responders by reporting what you see. Your information can save lives.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box sx={{ bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
              <FormControl fullWidth required>
                <InputLabel id="emergency-type-label">Emergency Type</InputLabel>
                <Select
                  labelId="emergency-type-label"
                  value={emergencyType}
                  label="Emergency Type"
                  onChange={e => setEmergencyType(e.target.value)}
                  renderValue={selected => {
                    const type = emergencyTypes.find(t => t.value === selected);
                    return (
                      <Box display="flex" alignItems="center" gap={1}>
                        {type?.icon}
                        <span>{type?.label}</span>
                      </Box>
                    );
                  }}
                >
                  {emergencyTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {type.icon}
                        <span>{type.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="text.secondary" mt={1}>
                  What is the main type of emergency you are reporting?
                </Typography>
              </FormControl>
              <Box mt={3}>
                <Typography fontWeight={500} mb={1}>Severity Level</Typography>
                <ToggleButtonGroup
                  value={severity}
                  exclusive
                  onChange={(_, val) => setSeverity(val)}
                  fullWidth
                  sx={{ gap: 2 }}
                >
                  {severityLevels.map(level => (
                    <motion.div key={level.value} whileTap={{ scale: 1.1 }} whileHover={{ scale: severity === level.value ? 1.08 : 1 }}>
                      <ToggleButton value={level.value} sx={{ flex: 1, border: '1px solid #eee', borderRadius: 2, py: 2, bgcolor: severity === level.value ? `${level.color}.light` : 'inherit', transition: 'background 0.2s' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: level.color === 'success' ? 'success.main' : level.color === 'warning' ? 'warning.main' : 'error.main', border: '1.5px solid #fff' }} />
                          <Typography fontWeight={600}>{level.label}</Typography>
                        </Box>
                      </ToggleButton>
                    </motion.div>
                  ))}
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" mt={1}>
                  How severe is the situation?
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
              <Typography fontWeight={500} mb={1}>Location</Typography>
              <Stack spacing={1}>
                <Autocomplete
                  freeSolo
                  filterOptions={x => x}
                  options={locationOptions}
                  getOptionLabel={option => typeof option === 'string' ? option : option.display_name}
                  loading={locationLoading}
                  value={location}
                  inputValue={location}
                  onInputChange={handleLocationInput}
                  onChange={handleLocationSelect}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="Enter address or describe location"
                      fullWidth
                      sx={{ fontSize: '1.1rem', '.MuiInputBase-root': { height: 56, fontSize: '1.1rem' } }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <RoomIcon color="action" sx={{ mr: 1 }} />,
                        endAdornment: (
                          <>
                            {locationLoading ? <CircularProgress color="inherit" size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={handleCurrentLocation}
                    sx={{ minWidth: 0, p: 1.5, borderRadius: '50%', boxShadow: 1 }}
                  >
                    <MyLocationIcon color="primary" fontSize="medium" />
                  </Button>
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" mt={1}>
                Please provide the most accurate location possible.
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
              <Typography fontWeight={500} mb={1}>Description</Typography>
              <TextField
                placeholder="Describe what you see, people affected, immediate dangers, etc."
                value={description}
                onChange={e => setDescription(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <Typography variant="caption" color="text.secondary" mt={1}>
                The more details you provide, the better responders can help.
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
              <Typography fontWeight={500} mb={1}>Contact Information</Typography>
              <TextField
                placeholder="Your phone number (optional but recommended)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} /> }}
                type="tel"
              />
              <Typography variant="caption" color="text.secondary" mt={1}>
                We may contact you for more information if needed.
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
              <Typography fontWeight={500} mb={1}>Photos (Optional)</Typography>
              <Dropzone onDrop={handleDrop} accept={{'image/*': []}} maxFiles={1}>
                {({ getRootProps, getInputProps }) => (
                  <motion.div {...getRootProps()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ outline: 'none' }}>
                    <Box sx={{ border: '2px dashed #1976d2', p: 2, borderRadius: 2, textAlign: 'center', cursor: 'pointer', bgcolor: '#fafbfc', transition: 'border 0.2s' }}>
                      <input {...getInputProps()} />
                      {photoPreview ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                          <Avatar src={photoPreview} variant="rounded" sx={{ width: 120, height: 90, mx: 'auto', mb: 1 }} />
                        </motion.div>
                      ) : (
                        <>
                          <PhotoCamera color="action" sx={{ fontSize: 32, mb: 1 }} />
                          <Typography variant="body2">Upload Photos</Typography>
                          <Typography variant="caption" color="text.secondary">Drag and drop or click to browse</Typography>
                        </>
                      )}
                    </Box>
                  </motion.div>
                )}
              </Dropzone>
            </Box>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" variant="contained" color="error" size="large" sx={{ mt: 2, minHeight: 48, fontWeight: 700, fontSize: '1.1rem', boxShadow: 2 }} disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Disaster Report'}
              </Button>
            </motion.div>
          </Stack>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default ReportFormPage; 