import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ChatAssistant from './ChatAssistant';

const ChatPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          MongoDB Logs AI Assistant
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Ask questions about your logs data in natural language
        </Typography>
      </Box>
      
      <ChatAssistant />
    </Container>
  );
};

export default ChatPage;