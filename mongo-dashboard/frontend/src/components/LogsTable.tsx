import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { fetchLogs } from '../services/api';
import { Log } from '../types';
import { Dayjs } from 'dayjs';

interface LogsTableProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  selectedCountries: string[];
  selectedSources: string[];
}

const LogsTable: React.FC<LogsTableProps> = ({ dateRange, selectedCountries, selectedSources }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
        
        // Sort the data
        filteredData.sort((a, b) => {
          const aValue = a[sortField as keyof Log];
          const bValue = b[sortField as keyof Log];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' 
              ? aValue.localeCompare(bValue) 
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          // Handle timestamp specifically
          if (sortField === 'timestamp') {
            return sortDirection === 'asc'
              ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          }
          
          return 0;
        });
        
        setLogs(filteredData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch logs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [dateRange, selectedCountries, selectedSources, sortField, sortDirection]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = (field: string) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

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
        <Typography color="error">{error || 'No logs available for the selected filters'}</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Logs {logs.length > 0 ? `(${logs.length})` : ''}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="logs table">
            <TableHead>
              <TableRow>
                <TableCell 
                  onClick={() => handleSort('country_code')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Country {renderSortArrow('country_code')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('currency_code')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Currency {renderSortArrow('currency_code')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('status')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Status {renderSortArrow('status')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('timestamp')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Timestamp {renderSortArrow('timestamp')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('transactionSourceName')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Transaction Source {renderSortArrow('transactionSourceName')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('recordCount')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Record Count {renderSortArrow('recordCount')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('uniqueRefNumberCount')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Unique Ref Count {renderSortArrow('uniqueRefNumberCount')}
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('noCoordinatesCount')}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  No Coordinates {renderSortArrow('noCoordinatesCount')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
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
                    <TableCell>{log.noCoordinatesCount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default LogsTable;