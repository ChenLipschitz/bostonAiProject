import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchCountryStats } from '../services/api';
import { CountryStats } from '../types';
import { Dayjs } from 'dayjs';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CountryChartProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}

const CountryChart: React.FC<CountryChartProps> = ({ dateRange }) => {
  const [countryStats, setCountryStats] = useState<CountryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCountryStats = async () => {
      try {
        setLoading(true);
        const data = await fetchCountryStats(dateRange);
        setCountryStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch country statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCountryStats();
  }, [dateRange]);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !countryStats) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error || 'No data available'}</Typography>
      </Card>
    );
  }

  const countries = Object.keys(countryStats);
  const recordCounts = Object.values(countryStats);

  const data = {
    labels: countries,
    datasets: [
      {
        label: 'Record Count by Country',
        data: recordCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Record Count by Country
        </Typography>
        <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Pie data={data} options={{ maintainAspectRatio: false }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountryChart;