import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendChatMessage, clarifyQuestion } from '../services/api';
import ChatChart from './ChatChart';
import { ChartData } from '../types';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  chartData?: ChartData;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to the MongoDB Logs Assistant! Ask me anything about your logs data.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to backend
      const response = await sendChatMessage(input);

      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        chartData: response.chartData
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Custom renderer for code blocks
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    table({ node, ...props }: any) {
      return (
        <div style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }} {...props} />
        </div>
      );
    },
    th({ node, ...props }: any) {
      return (
        <th
          style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'left'
          }}
          {...props}
        />
      );
    },
    td({ node, ...props }: any) {
      return (
        <td
          style={{
            border: '1px solid #ddd',
            padding: '8px',
          }}
          {...props}
        />
      );
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h5" gutterBottom>
          AI Chat Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ask questions about your MongoDB logs in natural language. For example:
          <Box component="ul" sx={{ mt: 1, ml: 2 }}>
            <li>What's the average number of records per log?</li>
            <li>Show me the top 5 countries by record count</li>
            <li>Compare completed vs. failed jobs across transaction sources</li>
            <li>What's the trend of unique reference counts over time?</li>
          </Box>
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Messages container */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            mb: 2, 
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: 'calc(100vh - 300px)',
            minHeight: '400px'
          }}
        >
          {messages.map((message, index) => (
            message.role !== 'system' ? (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.role === 'user' ? 'primary.light' : 'background.paper',
                  color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                }}
              >
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown components={components}>
                      {message.content}
                    </ReactMarkdown>
                    {message.chartData && (
                      <ChatChart chartData={message.chartData} />
                    )}
                  </>
                ) : (
                  <Typography>{message.content}</Typography>
                )}
              </Paper>
            ) : (
              <Typography 
                key={index} 
                variant="body2" 
                color="text.secondary" 
                align="center"
                sx={{ my: 1 }}
              >
                {message.content}
              </Typography>
            )
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Input area */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask a question about your logs data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={4}
            size="small"
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage} 
            disabled={loading || !input.trim()}
            sx={{ alignSelf: 'flex-end' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatAssistant;