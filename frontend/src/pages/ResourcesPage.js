import React from 'react';
import { Box, Typography, Paper, Grid, Button, Stack, Divider } from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningIcon from '@mui/icons-material/Warning';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ForumIcon from '@mui/icons-material/Forum';

const contacts = [
  {
    icon: <PhoneIcon color="error" />, label: 'Emergency Services', number: '112', color: 'error', tel: '112', primary: true
  },
  {
    icon: <LocalFireDepartmentIcon color="error" />, label: 'Fire Department', number: '101', color: 'error', tel: '101', primary: true
  },
  {
    icon: <LocalPoliceIcon color="error" />, label: 'Police Department', number: '100', color: 'error', tel: '100', primary: true
  },
  {
    icon: <FavoriteIcon color="error" />, label: 'Medical Emergency', number: '102', color: 'error', tel: '102', primary: true
  },
  {
    icon: <WarningIcon color="warning" />, label: 'Disaster Management', number: '108', color: 'warning', tel: '108', primary: false
  },
  {
    icon: <GroupIcon color="secondary" />, label: 'Women Helpline', number: '1091', color: 'secondary', tel: '1091', primary: false
  },
  {
    icon: <GroupIcon color="secondary" />, label: 'Child Helpline', number: '1098', color: 'secondary', tel: '1098', primary: false
  },
];

const guides = [
  {
    icon: <HomeIcon color="error" />,
    title: 'Emergency Preparedness Kit',
    desc: 'Essential items every household should have ready',
    points: [
      'Water (2 litres per person per day)',
      'Non-perishable food',
      'First aid kit',
      'Flashlight & batteries',
      'Radio',
      'Medications',
    ],
    link: 'https://ndma.gov.in/Resources/awareness/Do-s-and-Don-ts',
    linkText: 'NDMA Preparedness Guide',
  },
  {
    icon: <DirectionsRunIcon color="error" />,
    title: 'Evacuation Planning',
    desc: 'Know your routes and meeting points',
    points: [
      'Identify 2 evacuation routes',
      'Choose meeting locations',
      'Keep important documents ready',
      'Plan for pets',
      'Know shelter locations',
    ],
    link: 'https://ndma.gov.in/Resources/awareness/Do-s-and-Don-ts',
    linkText: 'NDMA Evacuation Tips',
  },
  {
    icon: <ForumIcon color="error" />,
    title: 'Communication Plan',
    desc: 'Stay connected during emergencies',
    points: [
      'Out-of-area contact person',
      'Local emergency contacts',
      'School/work emergency plans',
      'Social media check-ins',
      'Battery backup for phones',
    ],
    link: 'https://ndma.gov.in/Resources/awareness/Do-s-and-Don-ts',
    linkText: 'NDMA Communication Guide',
  },
];

const ResourcesPage = () => (
  <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, mb: 8 }}>
    <Typography variant="h3" fontWeight={700} align="center" mb={1}>
      Emergency Resources
    </Typography>
    <Typography color="text.secondary" align="center" mb={5}>
      Essential information to help you prepare for and respond to emergencies
    </Typography>
    <Typography variant="h5" fontWeight={600} mb={2}>
      Emergency Contacts
    </Typography>
    <Grid container spacing={3} mb={5}>
      {contacts.map((c, i) => (
        <Grid item xs={12} sm={6} md={4} key={c.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: c.primary ? '2px solid #e57373' : '1px solid #eee', mb: 1, boxShadow: c.primary ? '0 4px 24px rgba(211,47,47,0.08)' : undefined }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              {c.icon}
              <Box>
                <Typography fontWeight={600}>{c.label}</Typography>
                <Typography color={c.color + ".main"} fontWeight={700} fontSize={18}>{c.number}</Typography>
              </Box>
            </Stack>
            <Button
              variant={c.primary ? 'contained' : 'outlined'}
              color={c.primary ? 'error' : 'inherit'}
              fullWidth
              href={`tel:${c.tel}`}
              sx={{ mt: 2, fontWeight: 700, fontSize: '1rem', boxShadow: c.primary ? 2 : undefined }}
              startIcon={<PhoneIcon />}
            >
              Call Now
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Typography variant="h5" fontWeight={600} mb={2}>
      Preparedness Guides
    </Typography>
    <Grid container spacing={3}>
      {guides.map((g, i) => (
        <Grid item xs={12} sm={6} md={4} key={g.title}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              {g.icon}
              <Box>
                <Typography fontWeight={700}>{g.title}</Typography>
                <Typography color="text.secondary" fontSize={15}>{g.desc}</Typography>
              </Box>
            </Stack>
            <ul style={{ margin: '12px 0 0 0', paddingLeft: 20 }}>
              {g.points.map((pt, idx) => (
                <li key={idx} style={{ color: '#d32f2f', marginBottom: 4, fontSize: 15 }}>{pt}</li>
              ))}
            </ul>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="primary">
              <a href={g.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600 }}>{g.linkText}</a>
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ResourcesPage; 