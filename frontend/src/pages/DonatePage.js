import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Grid, TextField, Alert } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const donationOptions = [
  { amount: 50, label: 'Emergency meal for 1 person' },
  { amount: 100, label: 'First aid kit for a family' },
  { amount: 250, label: 'Emergency shelter materials' },
  { amount: 500, label: 'Communications equipment' },
  { amount: 1000, label: 'Emergency response kit' },
  { amount: 2500, label: 'Mobile emergency unit fuel' },
];

const DonatePage = () => {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', card: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (idx) => {
    setSelected(idx);
    setShowForm(true);
    setSuccess(false);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!form.name || !form.email || !form.card) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', card: '' });
      setShowForm(false);
      setSelected(null);
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          <CurrencyRupeeIcon color="error" sx={{ fontSize: 32, verticalAlign: 'middle', mr: 1 }} />
          Choose Your Impact
        </Typography>
        <Grid container spacing={2} mb={3} alignItems="stretch">
          {donationOptions.map((opt, idx) => (
            <Grid item xs={12} sm={6} key={opt.amount} sx={{ display: 'flex' }}>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(211,47,47,0.10)' }}
                whileTap={{ scale: 0.98 }}
                style={{ borderRadius: 16, width: '100%', display: 'flex', flex: 1 }}
              >
                <Paper
                  elevation={selected === idx ? 6 : 1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: selected === idx ? '2px solid #d32f2f' : '1px solid #eee',
                    cursor: 'pointer',
                    background: selected === idx ? '#fff5f5' : '#fff',
                    transition: 'all 0.2s',
                    boxShadow: selected === idx ? '0 4px 24px rgba(211,47,47,0.10)' : undefined,
                    height: 110,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  onClick={() => handleSelect(idx)}
                >
                  <Typography variant="h5" fontWeight={700} color="error.main" mb={0.5}>
                    ₹{opt.amount}
                  </Typography>
                  <Typography color="text.secondary">{opt.label}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {showForm && selected !== null && (
          <Box component="form" onSubmit={handlePay} sx={{ mt: 3, mb: 2, textAlign: 'left' }}>
            <Typography variant="h6" mb={2} color="primary">Donate ₹{donationOptions[selected].amount}</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Stack spacing={2}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth type="email" />
              <TextField label="Card Number" name="card" value={form.card} onChange={handleChange} fullWidth type="text" inputProps={{ maxLength: 16 }} />
              <Button type="submit" variant="contained" color="error" size="large" disabled={loading} fullWidth sx={{ fontWeight: 700, fontSize: '1.1rem', boxShadow: 2 }}>
                {loading ? 'Processing...' : `Donate ₹${donationOptions[selected].amount}`}
              </Button>
            </Stack>
          </Box>
        )}
        {success && (
          <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mt: 3, fontWeight: 600 }}>
            Thank you for your generous donation!
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default DonatePage; 