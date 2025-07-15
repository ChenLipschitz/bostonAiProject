"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openaiService_1 = require("../services/openaiService");
const router = express_1.default.Router();
// Endpoint to handle chat messages
router.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Process the user's question
        const result = yield (0, openaiService_1.processQuestion)(message);
        return res.json(result);
    }
    catch (error) {
        console.error('Error in chat endpoint:', error);
        return res.status(500).json({ error: 'Failed to process your question' });
    }
}));
// Endpoint to handle ambiguous questions
router.post('/chat/clarify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Handle ambiguous question
        const response = yield (0, openaiService_1.handleAmbiguousQuestion)(message);
        return res.json({ response });
    }
    catch (error) {
        console.error('Error in clarify endpoint:', error);
        return res.status(500).json({ error: 'Failed to process your question' });
    }
}));
exports.default = router;
