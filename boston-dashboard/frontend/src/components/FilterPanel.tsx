import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Divider
} from '@mui/material';
import { fetchLogs } from '../services/api';
import { Log } from '../types';
import { Dayjs } from 'dayjs';
import DateRangePicker from './DateRangePicker';

interface FilterPanelProps {
  dateRange: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  };
  onDateRangeChange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  selectedSources: string[];
  onSourcesChange: (sources: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  dateRange, 
  onDateRangeChange,
  selectedCountries,
  onCountriesChange,
  selectedSources,
  onSourcesChange
}) => {
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const logs = await fetchLogs();
        
        // Extract unique countries and sources
        const countries = Array.from(new Set(logs.map(log => log.country_code))).sort();
        const sources = Array.from(new Set(logs.map(log => log.transactionSourceName))).sort();
        
        setAvailableCountries(countries);
        setAvailableSources(sources);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleCountryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onCountriesChange(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onSourcesChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dashboard Filters
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onStartDateChange={(date) => onDateRangeChange(date, dateRange.endDate)}
              onEndDateChange={(date) => onDateRangeChange(dateRange.startDate, date)}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="country-select-label">Countries</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              multiple
              value={selectedCountries}
              onChange={handleCountryChange}
              input={<OutlinedInput label="Countries" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250,
                  },
                },
              }}
            >
              {availableCountries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="source-select-label">Transaction Sources</InputLabel>
            <Select
              labelId="source-select-label"
              id="source-select"
              multiple
              value={selectedSources}
              onChange={handleSourceChange}
              input={<OutlinedInput label="Transaction Sources" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    width: 250,
                  },
                },
              }}
            >
              {availableSources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;