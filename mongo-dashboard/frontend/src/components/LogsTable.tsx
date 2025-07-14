import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridValueFormatterParams,
  GridSortModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
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
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'timestamp',
      sort: 'desc',
    },
  ]);
  const [pageSize, setPageSize] = useState<number>(10);

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
  }, [dateRange, selectedCountries, selectedSources]);

  const columns: GridColDef[] = [
    { 
      field: 'country_code', 
      headerName: 'Country', 
      width: 120,
      sortable: true,
    },
    { 
      field: 'currency_code', 
      headerName: 'Currency', 
      width: 120,
      sortable: true,
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          sx={{
            color: params.value === 'completed' ? 'success.main' : 'warning.main',
            textTransform: 'capitalize',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'timestamp', 
      headerName: 'Timestamp', 
      width: 200,
      sortable: true,
      valueFormatter: (params: GridValueFormatterParams) => {
        return new Date(params.value as string).toLocaleString();
      },
    },
    { 
      field: 'transactionSourceName', 
      headerName: 'Transaction Source', 
      width: 180,
      sortable: true,
    },
    { 
      field: 'recordCount', 
      headerName: 'Record Count', 
      width: 150,
      sortable: true,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams) => {
        return (params.value as number).toLocaleString();
      },
    },
    { 
      field: 'uniqueRefNumberCount', 
      headerName: 'Unique Ref Count', 
      width: 180,
      sortable: true,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams) => {
        return (params.value as number).toLocaleString();
      },
    },
    { 
      field: 'noCoordinatesCount', 
      headerName: 'No Coordinates', 
      width: 150,
      sortable: true,
      type: 'number',
      valueFormatter: (params: GridValueFormatterParams) => {
        return (params.value as number).toLocaleString();
      },
    },
  ];

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
      <CardContent sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Logs {logs.length > 0 ? `(${logs.length})` : ''}
          </Typography>
        </Box>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={logs}
            columns={columns}
            getRowId={(row) => row._id}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            disableSelectionOnClick
            density="standard"
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LogsTable;