import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CardMedia, Chip, Stack } from '@mui/material';
import axios from 'axios';

const ReportFeed = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get('http://localhost:5000/api/reports');
    setReports(res.data);
  };

  return (
    <Stack spacing={2}>
      {reports.map(report => (
        <Card key={report.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {report.image_url && (
            <CardMedia
              component="img"
              image={report.image_url}
              alt="Report"
              sx={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 2, ml: 2 }}
            />
          )}
          <CardContent sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip label={report.severity} color={
                report.severity === 'Severe' ? 'error' : report.severity === 'Moderate' ? 'warning' : 'success'
              } />
              <Typography variant="caption" color="text.secondary">
                {report.address || `Lat: ${report.lat}, Lng: ${report.lng}`}
              </Typography>
            </Box>
            <Typography variant="body1">{report.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ReportFeed; 