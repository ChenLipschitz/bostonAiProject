import axios from 'axios';
import { Log, CountryStats, StatusStats, ProgressStats, ChatResponse } from '../types';
import { Dayjs } from 'dayjs';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:12000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export const fetchLogs = async (dateRange?: { startDate: Dayjs | null; endDate: Dayjs | null }): Promise<Log[]> => {
  const params: DateRangeParams = {};
  
  if (dateRange?.startDate) {
    params.startDate = dateRange.startDate.toISOString();
  }
  
  if (dateRange?.endDate) {
    params.endDate = dateRange.endDate.toISOString();
  }
  
  const response = await api.get<Log[]>('/logs', { params });
  return response.data;
};

export const fetchCountryStats = async (dateRange?: { startDate: Dayjs | null; endDate: Dayjs | null }): Promise<CountryStats> => {
  const params: DateRangeParams = {};
  
  if (dateRange?.startDate) {
    params.startDate = dateRange.startDate.toISOString();
  }
  
  if (dateRange?.endDate) {
    params.endDate = dateRange.endDate.toISOString();
  }
  
  const response = await api.get<CountryStats>('/stats/country', { params });
  return response.data;
};

export const fetchStatusStats = async (dateRange?: { startDate: Dayjs | null; endDate: Dayjs | null }): Promise<StatusStats> => {
  const params: DateRangeParams = {};
  
  if (dateRange?.startDate) {
    params.startDate = dateRange.startDate.toISOString();
  }
  
  if (dateRange?.endDate) {
    params.endDate = dateRange.endDate.toISOString();
  }
  
  const response = await api.get<StatusStats>('/stats/status', { params });
  return response.data;
};

export const fetchProgressStats = async (dateRange?: { startDate: Dayjs | null; endDate: Dayjs | null }): Promise<ProgressStats> => {
  const params: DateRangeParams = {};
  
  if (dateRange?.startDate) {
    params.startDate = dateRange.startDate.toISOString();
  }
  
  if (dateRange?.endDate) {
    params.endDate = dateRange.endDate.toISOString();
  }
  
  const response = await api.get<ProgressStats>('/stats/progress', { params });
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  console.log("heeeeee")
  const response = await api.post<ChatResponse>('/chat', { message });
  return response.data;
};

export const clarifyQuestion = async (message: string): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat/clarify', { message });
  return response.data;
};