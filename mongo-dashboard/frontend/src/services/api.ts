import axios from 'axios';
import { Log, CountryStats, StatusStats, ProgressStats } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:12000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchLogs = async (): Promise<Log[]> => {
  const response = await api.get<Log[]>('/logs');
  return response.data;
};

export const fetchCountryStats = async (): Promise<CountryStats> => {
  const response = await api.get<CountryStats>('/stats/country');
  return response.data;
};

export const fetchStatusStats = async (): Promise<StatusStats> => {
  const response = await api.get<StatusStats>('/stats/status');
  return response.data;
};

export const fetchProgressStats = async (): Promise<ProgressStats> => {
  const response = await api.get<ProgressStats>('/stats/progress');
  return response.data;
};