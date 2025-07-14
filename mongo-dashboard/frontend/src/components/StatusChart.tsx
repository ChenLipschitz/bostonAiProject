import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchStatusStats } from '../services/api';
import { StatusStats } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusChart: React.FC = () => {
  const [statusStats, setStatusStats] = useState<StatusStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStatusStats = async () => {
      try {
        const data = await fetchStatusStats();
        setStatusStats(data);
      } catch (err) {
        setError('Failed to fetch status statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStatusStats();
  }, []);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !statusStats) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error || 'No data available'}</Typography>
      </Card>
    );
  }

  const statuses = Object.keys(statusStats);
  const counts = Object.values(statusStats);

  const data = {
    labels: statuses.map(status => status.charAt(0).toUpperCase() + status.slice(1)),
    datasets: [
      {
        label: 'Status Distribution',
        data: counts,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Status Distribution
        </Typography>
        <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Doughnut data={data} options={{ maintainAspectRatio: false }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatusChart;