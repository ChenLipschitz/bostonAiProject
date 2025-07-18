import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchStatusStats, fetchLogs } from '../services/api';
import { StatusStats } from '../types';
import { Dayjs } from 'dayjs';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusChartProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  selectedCountries: string[];
  selectedSources: string[];
}

const StatusChart: React.FC<StatusChartProps> = ({ dateRange, selectedCountries, selectedSources }) => {
  const [statusStats, setStatusStats] = useState<StatusStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStatusStats = async () => {
      try {
        setLoading(true);
        
        // Fetch logs instead of pre-aggregated stats to apply client-side filtering
        const logs = await fetchLogs(dateRange);
        
        // Filter logs by selected countries and sources if any are selected
        let filteredLogs = [...logs];
        
        if (selectedCountries.length > 0) {
          filteredLogs = filteredLogs.filter(log => selectedCountries.includes(log.country_code));
        }
        
        if (selectedSources.length > 0) {
          filteredLogs = filteredLogs.filter(log => selectedSources.includes(log.transactionSourceName));
        }
        
        // Calculate status stats from filtered logs
        const statusStatsData: StatusStats = {};
        
        filteredLogs.forEach(log => {
          if (!statusStatsData[log.status]) {
            statusStatsData[log.status] = 0;
          }
          statusStatsData[log.status]++;
        });
        
        setStatusStats(statusStatsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch status statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStatusStats();
  }, [dateRange, selectedCountries, selectedSources]);

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