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
import { fetchProgressStats, fetchLogs } from '../services/api';
import { ProgressStats } from '../types';
import { Dayjs } from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  selectedCountries: string[];
  selectedSources: string[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ dateRange, selectedCountries, selectedSources }) => {
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProgressStats = async () => {
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
        
        // Calculate progress stats from filtered logs
        const progressStatsData: ProgressStats = {
          totalRecordsInFeed: 0,
          totalJobsFailIndexed: 0,
          totalJobsInFeed: 0,
          totalJobsSentToEnrich: 0,
          totalJobsDontHaveMetadata: 0,
          totalJobsDontHaveMetadataV2: 0,
          totalJobsSentToIndex: 0
        };
        
        filteredLogs.forEach(log => {
          progressStatsData.totalRecordsInFeed += log.progress.TOTAL_RECORDS_IN_FEED || 0;
          progressStatsData.totalJobsFailIndexed += log.progress.TOTAL_JOBS_FAIL_INDEXED || 0;
          progressStatsData.totalJobsInFeed += log.progress.TOTAL_JOBS_IN_FEED || 0;
          progressStatsData.totalJobsSentToEnrich += log.progress.TOTAL_JOBS_SENT_TO_ENRICH || 0;
          progressStatsData.totalJobsDontHaveMetadata += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA || 0;
          progressStatsData.totalJobsDontHaveMetadataV2 += log.progress.TOTAL_JOBS_DONT_HAVE_METADATA_V2 || 0;
          progressStatsData.totalJobsSentToIndex += log.progress.TOTAL_JOBS_SENT_TO_INDEX || 0;
        });
        
        setProgressStats(progressStatsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch progress statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProgressStats();
  }, [dateRange, selectedCountries, selectedSources]);

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