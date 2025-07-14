import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Divider } from '@mui/material';
import CountryChart from './CountryChart';
import StatusChart from './StatusChart';
import ProgressChart from './ProgressChart';
import LogsTable from './LogsTable';
import FilterPanel from './FilterPanel';
import TrendChart from './TrendChart';
import MetricsCard from './MetricsCard';
import dayjs, { Dayjs } from 'dayjs';

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  const dateRange = {
    startDate,
    endDate
  };

  const handleDateRangeChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          MongoDB Logs Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualizing log data from MongoDB collection
        </Typography>
      </Box>
      
      {/* Filter Panel */}
      <FilterPanel 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        selectedCountries={selectedCountries}
        onCountriesChange={setSelectedCountries}
        selectedSources={selectedSources}
        onSourcesChange={setSelectedSources}
      />
      
      {/* Metrics Dashboard */}
      <Box sx={{ mb: 3 }}>
        <MetricsCard 
          dateRange={dateRange} 
          selectedCountries={selectedCountries}
          selectedSources={selectedSources}
        />
      </Box>
      
      {/* Trend Chart */}
      <Box sx={{ mb: 3 }}>
        <TrendChart 
          dateRange={dateRange} 
          selectedCountries={selectedCountries}
          selectedSources={selectedSources}
        />
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Distribution Charts */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Data Distribution
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <CountryChart 
            dateRange={dateRange} 
            selectedCountries={selectedCountries}
            selectedSources={selectedSources}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusChart 
            dateRange={dateRange} 
            selectedCountries={selectedCountries}
            selectedSources={selectedSources}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressChart 
            dateRange={dateRange} 
            selectedCountries={selectedCountries}
            selectedSources={selectedSources}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Logs Table */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Detailed Logs
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <LogsTable 
          dateRange={dateRange} 
          selectedCountries={selectedCountries}
          selectedSources={selectedSources}
        />
      </Box>
    </Container>
  );
};

export default Dashboard;