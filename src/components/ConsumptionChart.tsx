import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Meter } from '../types';
import { generateMonthlyConsumption } from '../utils/dataUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ConsumptionChartProps {
  meter: Meter;
  darkMode: boolean;
  chartType: 'bar' | 'line';
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  meter,
  darkMode,
  chartType
}) => {
  const { t } = useTranslation();
  const data = generateMonthlyConsumption(meter);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: t('chart.actualConsumption'),
        data: data.map(d => d.isForecasted ? null : d.consumption),
        backgroundColor: data.map(d => {
          if (d.isForecasted) return 'transparent';
          return d.isCurrent 
            ? darkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)'
            : darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)';
        }),
        borderColor: data.map(d => {
          if (d.isForecasted) return 'transparent';
          return d.isCurrent 
            ? darkMode ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 0.8)'
            : darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.8)';
        }),
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: t('chart.forecastedConsumption'),
        data: data.map(d => d.isForecasted ? d.consumption : null),
        backgroundColor: darkMode ? 'rgba(156, 163, 175, 0.4)' : 'rgba(156, 163, 175, 0.3)',
        borderColor: darkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(156, 163, 175, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#E5E7EB' : '#374151',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${t('chart.monthlyConsumption')} - ${meter.number}`,
        color: darkMode ? '#E5E7EB' : '#374151',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
        titleColor: darkMode ? '#E5E7EB' : '#374151',
        bodyColor: darkMode ? '#E5E7EB' : '#374151',
        borderColor: darkMode ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const isForecasted = context.datasetIndex === 1;
            const isCurrent = data[context.dataIndex]?.isCurrent;
            let suffix = '';
            if (isForecasted) suffix = ` (${t('chart.estimated')})`;
            else if (isCurrent) suffix = ' (current)';
            return `${label}: ${value?.toFixed(2)}${suffix}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      }
    }
  };

  return (
    <div className="h-80 w-full">
      {chartType === 'bar' ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default ConsumptionChart;