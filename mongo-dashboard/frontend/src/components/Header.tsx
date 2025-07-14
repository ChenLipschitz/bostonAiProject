import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" justifyContent="center" width="100%">
          <Typography variant="h6" component="div">
            MongoDB Logs Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;