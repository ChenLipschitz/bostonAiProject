import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { fetchLogs } from '../services/api';
import { Log } from '../types';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  selectedCountries: string[];
  selectedSources: string[];
}

const TrendChart: React.FC<TrendChartProps> = ({ dateRange, selectedCountries, selectedSources }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchLogs(dateRange);
        
        // Filter logs by selected countries and sources if any are selected
        let filteredData = [...data];
        
        if (selectedCountries.length > 0) {
          filteredData = filteredData.filter(log => selectedCountries.includes(log.country_code));
        }
        
        if (selectedSources.length > 0) {
          filteredData = filteredData.filter(log => selectedSources.includes(log.transactionSourceName));
        }
        
        // Sort logs by timestamp
        filteredData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        setLogs(filteredData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch logs for trend analysis');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [dateRange, selectedCountries, selectedSources]);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || logs.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error || 'No data available for the selected filters'}</Typography>
      </Card>
    );
  }

  // Group logs by day
  const logsByDay = logs.reduce((acc, log) => {
    const day = dayjs(log.timestamp).format('YYYY-MM-DD');
    if (!acc[day]) {
      acc[day] = {
        count: 0,
        recordCount: 0,
        uniqueRefNumberCount: 0,
      };
    }
    acc[day].count += 1;
    acc[day].recordCount += log.recordCount;
    acc[day].uniqueRefNumberCount += log.uniqueRefNumberCount;
    return acc;
  }, {} as Record<string, { count: number; recordCount: number; uniqueRefNumberCount: number }>);

  // Prepare data for the chart
  const days = Object.keys(logsByDay).sort();
  const recordCounts = days.map(day => logsByDay[day].recordCount);
  const uniqueRefCounts = days.map(day => logsByDay[day].uniqueRefNumberCount);
  const logCounts = days.map(day => logsByDay[day].count);

  // Calculate averages
  const avgRecordCount = recordCounts.length > 0 
    ? Math.round(recordCounts.reduce((sum, count) => sum + count, 0) / recordCounts.length) 
    : 0;
  
  const avgUniqueRefCount = uniqueRefCounts.length > 0 
    ? Math.round(uniqueRefCounts.reduce((sum, count) => sum + count, 0) / uniqueRefCounts.length) 
    : 0;

  // Identify outliers (values that are 50% higher than the average)
  const recordOutliers = recordCounts.map((count, index) => 
    count > avgRecordCount * 1.5 ? { x: days[index], y: count } : null
  ).filter(Boolean);

  const uniqueRefOutliers = uniqueRefCounts.map((count, index) => 
    count > avgUniqueRefCount * 1.5 ? { x: days[index], y: count } : null
  ).filter(Boolean);

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Record Count',
        data: recordCounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Unique Reference Count',
        data: uniqueRefCounts,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Log Count',
        data: logCounts,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
        fill: false,
      },
      // Outliers for Record Count
      {
        label: 'Record Count Outliers',
        data: recordOutliers,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
      // Outliers for Unique Reference Count
      {
        label: 'Unique Ref Count Outliers',
        data: uniqueRefOutliers,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trend Analysis
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Avg Record Count: <strong>{avgRecordCount.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avg Unique Ref Count: <strong>{avgUniqueRefCount.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Days: <strong>{days.length}</strong>
          </Typography>
        </Box>
        <Box sx={{ height: 300 }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrendChart;