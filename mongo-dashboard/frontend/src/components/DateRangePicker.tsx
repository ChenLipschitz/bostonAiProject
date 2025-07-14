import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filter Logs by Date Range
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  size: 'small',
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={onEndDateChange}
              minDate={startDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  size: 'small',
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DateRangePicker;