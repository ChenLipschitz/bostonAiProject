import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChatChartProps {
  chartData: ChartData;
}

const ChatChart: React.FC<ChatChartProps> = ({ chartData }) => {
  const { type, title, labels, datasets } = chartData;

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: type === 'pie' || type === 'doughnut' ? undefined : {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data Visualization
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          {renderChart()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatChart;