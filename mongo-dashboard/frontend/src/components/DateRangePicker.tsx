import React from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

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
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
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
  );
};

export default DateRangePicker;