import express from 'express';
import { processQuestion, handleAmbiguousQuestion } from '../services/openaiService';

const router = express.Router();

// Endpoint to handle chat messages
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Process the user's question
    const response = await processQuestion(message);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ error: 'Failed to process your question' });
  }
});

// Endpoint to handle ambiguous questions
router.post('/chat/clarify', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Handle ambiguous question
    const response = await handleAmbiguousQuestion(message);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error in clarify endpoint:', error);
    return res.status(500).json({ error: 'Failed to process your question' });
  }
});

export default router;