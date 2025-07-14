import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CountryChart from './CountryChart';
import StatusChart from './StatusChart';
import ProgressChart from './ProgressChart';
import LogsTable from './LogsTable';

const Dashboard: React.FC = () => {
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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {/* Charts */}
        <div>
          <CountryChart />
        </div>
        <div>
          <StatusChart />
        </div>
        <div>
          <ProgressChart />
        </div>
      </div>
      
      {/* Logs Table */}
      <div style={{ marginTop: '24px' }}>
        <LogsTable />
      </div>
    </Container>
  );
};

export default Dashboard;