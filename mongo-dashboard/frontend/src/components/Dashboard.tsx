import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import CountryChart from './CountryChart';
import StatusChart from './StatusChart';
import ProgressChart from './ProgressChart';
import LogsTable from './LogsTable';
import DateRangePicker from './DateRangePicker';
import dayjs, { Dayjs } from 'dayjs';

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  
  const dateRange = {
    startDate,
    endDate
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
      
      {/* Date Range Picker */}
      <DateRangePicker 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {/* Charts */}
        <div>
          <CountryChart dateRange={dateRange} />
        </div>
        <div>
          <StatusChart dateRange={dateRange} />
        </div>
        <div>
          <ProgressChart dateRange={dateRange} />
        </div>
      </div>
      
      {/* Logs Table */}
      <div style={{ marginTop: '24px' }}>
        <LogsTable dateRange={dateRange} />
      </div>
    </Container>
  );
};

export default Dashboard;