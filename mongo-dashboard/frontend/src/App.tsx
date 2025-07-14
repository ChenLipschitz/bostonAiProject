import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Box, Tab, Tabs } from '@mui/material';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="navigation tabs"
            centered
          >
            <Tab label="Dashboard" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="AI Assistant" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>
        <main>
          <TabPanel value={tabValue} index={0}>
            <Dashboard />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ChatPage />
          </TabPanel>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
