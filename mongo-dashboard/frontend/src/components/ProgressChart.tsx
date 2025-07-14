import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchProgressStats } from '../services/api';
import { ProgressStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart: React.FC = () => {
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProgressStats = async () => {
      try {
        const data = await fetchProgressStats();
        setProgressStats(data);
      } catch (err) {
        setError('Failed to fetch progress statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProgressStats();
  }, []);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !progressStats) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error || 'No data available'}</Typography>
      </Card>
    );
  }

  const labels = [
    'Total Records in Feed',
    'Total Jobs in Feed',
    'Total Jobs Sent to Index',
    'Total Jobs Failed Indexed',
    'Total Jobs Sent to Enrich',
    'Total Jobs No Metadata',
    'Total Jobs No Metadata V2',
  ];

  const values = [
    progressStats.totalRecordsInFeed,
    progressStats.totalJobsInFeed,
    progressStats.totalJobsSentToIndex,
    progressStats.totalJobsFailIndexed,
    progressStats.totalJobsSentToEnrich,
    progressStats.totalJobsDontHaveMetadata,
    progressStats.totalJobsDontHaveMetadataV2,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Progress Statistics',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Progress Statistics
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;