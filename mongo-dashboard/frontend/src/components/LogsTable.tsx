import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { fetchLogs } from '../services/api';
import { Log } from '../types';
import { Dayjs } from 'dayjs';

interface LogsTableProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
}

const LogsTable: React.FC<LogsTableProps> = ({ dateRange }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchLogs(dateRange);
        setLogs(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch logs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [dateRange]);

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
        <Typography color="error">{error || 'No logs available for the selected date range'}</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Logs {logs.length > 0 ? `(${logs.length})` : ''}
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="logs table">
            <TableHead>
              <TableRow>
                <TableCell>Country</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Transaction Source</TableCell>
                <TableCell>Record Count</TableCell>
                <TableCell>Unique Ref Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.country_code}</TableCell>
                  <TableCell>{log.currency_code}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: log.status === 'completed' ? 'success.main' : 'warning.main',
                        textTransform: 'capitalize',
                      }}
                    >
                      {log.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.transactionSourceName}</TableCell>
                  <TableCell>{log.recordCount.toLocaleString()}</TableCell>
                  <TableCell>{log.uniqueRefNumberCount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default LogsTable;