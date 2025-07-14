import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { fetchLogs } from '../services/api';
import { Log } from '../types';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface MetricsCardProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  selectedCountries: string[];
  selectedSources: string[];
}

interface Metrics {
  totalLogs: number;
  totalRecords: number;
  totalUniqueRefs: number;
  avgRecordsPerLog: number;
  avgUniqueRefsPerLog: number;
  completedPercentage: number;
  countriesCount: number;
  sourcesCount: number;
  // Deltas (percentage change from previous period)
  logsDelta: number;
  recordsDelta: number;
  uniqueRefsDelta: number;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ dateRange, selectedCountries, selectedSources }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch logs for the selected date range
        const currentLogs = await fetchLogs(dateRange);
        
        // Filter logs by selected countries and sources if any are selected
        let filteredLogs = [...currentLogs];
        
        if (selectedCountries.length > 0) {
          filteredLogs = filteredLogs.filter(log => selectedCountries.includes(log.country_code));
        }
        
        if (selectedSources.length > 0) {
          filteredLogs = filteredLogs.filter(log => selectedSources.includes(log.transactionSourceName));
        }
        
        // Calculate current period metrics
        const totalLogs = filteredLogs.length;
        const totalRecords = filteredLogs.reduce((sum, log) => sum + log.recordCount, 0);
        const totalUniqueRefs = filteredLogs.reduce((sum, log) => sum + log.uniqueRefNumberCount, 0);
        const avgRecordsPerLog = totalLogs > 0 ? Math.round(totalRecords / totalLogs) : 0;
        const avgUniqueRefsPerLog = totalLogs > 0 ? Math.round(totalUniqueRefs / totalLogs) : 0;
        const completedLogs = filteredLogs.filter(log => log.status === 'completed').length;
        const completedPercentage = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;
        
        // Count unique countries and sources
        const uniqueCountries = new Set(filteredLogs.map(log => log.country_code));
        const uniqueSources = new Set(filteredLogs.map(log => log.transactionSourceName));
        
        // Calculate previous period for delta comparison
        let previousStartDate = null;
        let previousEndDate = null;
        
        if (dateRange.startDate && dateRange.endDate) {
          const duration = dateRange.endDate.diff(dateRange.startDate, 'day');
          previousStartDate = dateRange.startDate.subtract(duration, 'day');
          previousEndDate = dateRange.startDate.subtract(1, 'day');
        } else if (dateRange.startDate) {
          // If only start date is provided, use same duration before start date
          const today = dayjs();
          const duration = today.diff(dateRange.startDate, 'day');
          previousStartDate = dateRange.startDate.subtract(duration, 'day');
          previousEndDate = dateRange.startDate.subtract(1, 'day');
        } else if (dateRange.endDate) {
          // If only end date is provided, use same duration before end date
          const duration = 7; // Default to 7 days
          previousStartDate = dateRange.endDate.subtract(duration * 2, 'day');
          previousEndDate = dateRange.endDate.subtract(duration, 'day');
        } else {
          // If no date range, compare with previous 7 days
          previousStartDate = dayjs().subtract(14, 'day');
          previousEndDate = dayjs().subtract(7, 'day');
        }
        
        // Fetch previous period logs
        const previousLogs = await fetchLogs({
          startDate: previousStartDate,
          endDate: previousEndDate
        });
        
        // Filter previous logs by the same criteria
        let filteredPreviousLogs = [...previousLogs];
        
        if (selectedCountries.length > 0) {
          filteredPreviousLogs = filteredPreviousLogs.filter(log => selectedCountries.includes(log.country_code));
        }
        
        if (selectedSources.length > 0) {
          filteredPreviousLogs = filteredPreviousLogs.filter(log => selectedSources.includes(log.transactionSourceName));
        }
        
        // Calculate previous period metrics for delta
        const previousTotalLogs = filteredPreviousLogs.length;
        const previousTotalRecords = filteredPreviousLogs.reduce((sum, log) => sum + log.recordCount, 0);
        const previousTotalUniqueRefs = filteredPreviousLogs.reduce((sum, log) => sum + log.uniqueRefNumberCount, 0);
        
        // Calculate deltas (percentage change)
        const logsDelta = previousTotalLogs > 0 
          ? Math.round(((totalLogs - previousTotalLogs) / previousTotalLogs) * 100) 
          : 0;
        
        const recordsDelta = previousTotalRecords > 0 
          ? Math.round(((totalRecords - previousTotalRecords) / previousTotalRecords) * 100) 
          : 0;
        
        const uniqueRefsDelta = previousTotalUniqueRefs > 0 
          ? Math.round(((totalUniqueRefs - previousTotalUniqueRefs) / previousTotalUniqueRefs) * 100) 
          : 0;
        
        setMetrics({
          totalLogs,
          totalRecords,
          totalUniqueRefs,
          avgRecordsPerLog,
          avgUniqueRefsPerLog,
          completedPercentage,
          countriesCount: uniqueCountries.size,
          sourcesCount: uniqueSources.size,
          logsDelta,
          recordsDelta,
          uniqueRefsDelta
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to calculate metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    calculateMetrics();
  }, [dateRange, selectedCountries, selectedSources]);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error || 'No metrics available'}</Typography>
      </Card>
    );
  }

  // Helper function to render delta indicators
  const renderDelta = (delta: number) => {
    if (delta === 0) return null;
    
    const color = delta > 0 ? 'success.main' : 'error.main';
    const icon = delta > 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    
    return (
      <Box component="span" sx={{ color, display: 'inline-flex', alignItems: 'center', ml: 1 }}>
        {icon}
        {Math.abs(delta)}%
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Key Metrics Dashboard
        </Typography>
        <Grid container spacing={2}>
          {/* First row */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Logs
              </Typography>
              <Typography variant="h4">
                {metrics.totalLogs.toLocaleString()}
                {renderDelta(metrics.logsDelta)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics.completedPercentage}% completed
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Records
              </Typography>
              <Typography variant="h4">
                {metrics.totalRecords.toLocaleString()}
                {renderDelta(metrics.recordsDelta)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg {metrics.avgRecordsPerLog.toLocaleString()} per log
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Unique References
              </Typography>
              <Typography variant="h4">
                {metrics.totalUniqueRefs.toLocaleString()}
                {renderDelta(metrics.uniqueRefsDelta)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg {metrics.avgUniqueRefsPerLog.toLocaleString()} per log
              </Typography>
            </Paper>
          </Grid>
          
          {/* Second row */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Countries
              </Typography>
              <Typography variant="h5">
                {metrics.countriesCount.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction Sources
              </Typography>
              <Typography variant="h5">
                {metrics.sourcesCount.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;