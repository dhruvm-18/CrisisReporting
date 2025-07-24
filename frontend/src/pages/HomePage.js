import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Container, Stack, Paper, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import ShieldIcon from '@mui/icons-material/Shield';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const bgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 60000); // minutes
  if (diff < 1) return 'just now';
  if (diff === 1) return '1 min ago';
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

const demoFeed = [
  { type: 'Flood', location: 'Kolkata, West Bengal', time: '2024-07-24T10:00:00Z' },
  { type: 'Fire', location: 'Delhi', time: '2024-07-24T09:55:00Z' },
  { type: 'Power Outage', location: 'Noida', time: '2024-07-24T09:50:00Z' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        const reports = res.data
          .sort((a, b) => new Date(b.timestamp || b.time || 0) - new Date(a.timestamp || a.time || 0))
          .slice(0, 5)
          .map(r => ({
            type: r.emergencyType || r.type || 'Incident',
            location: r.address || r.location || 'Unknown',
            time: r.timestamp || r.time || new Date().toISOString(),
          }));
        setFeed(reports.length ? reports : demoFeed);
      } catch {
        setFeed(demoFeed);
      }
    }
    fetchFeed();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: `url(${bgUrl}) center/cover no-repeat`, position: 'relative' }}>
      {/* Overlay */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }} />
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, pt: 10, pb: 6 }}>
        <Stack alignItems="center" spacing={3}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" align="center" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              <Box component="span" sx={{ color: '#1976d2' }}>Report.</Box>{' '}
              <Box component="span" sx={{ color: '#d32f2f' }}>Respond.</Box>{' '}
              <Box component="span" sx={{ color: '#388e3c' }}>Recover.</Box>
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Join thousands of citizens helping emergency responders save lives<br />
              through real-time disaster reporting and community coordination.
            </Typography>
          </motion.div>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="large"
                variant="contained"
                color="error"
                sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem' }}
                onClick={() => navigate('/reports')}
              >
                REPORT EMERGENCY NOW
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                sx={{ fontWeight: 700, px: 4, py: 1.5, fontSize: '1.1rem', bgcolor: 'white', color: 'primary.main', boxShadow: 2 }}
                onClick={() => navigate('/live-map')}
              >
                VIEW LIVE MAP
              </Button>
            </motion.div>
          </Stack>
        </Stack>
      </Container>
      {/* Recent Activity Feed */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, pb: 8 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)', mt: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Recent Activity
            </Typography>
            <List>
              {feed.map((item, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                      <LocationOnIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={<span><b>{item.type}</b> reported in <b>{item.location}</b></span>}
                    secondary={<span style={{ color: '#888' }}>{timeAgo(item.time)}</span>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage; 