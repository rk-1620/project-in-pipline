import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

// Register chart components
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

/////////////////////////////////////////////////////
// 🔵 Pie Chart Component - Spending by Category %
/////////////////////////////////////////////////////

export const SpendingPieChart = ({ data = {} }) => {
  const categories = data.map(item => item.name);      // ['food', 'travel', 'shopping']
  const amounts = data.map(item => item.value);        // [100, 200, 300]


  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Spending by Category',
        data: amounts,
        backgroundColor: [
          '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#f44336', '#00bcd4'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.chart.data.labels[context.dataIndex];   // Category name
            const value = context.raw;                                    // Amount
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

            return `${label}: ₹${value} (${percent}%)`;
          },
        },
      },

      legend: {
        position: 'bottom',
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            const dataset = data.datasets[0];

            return data.labels.map((label, i) => {
              const value = dataset.data[i];
              return {
                text: `${label}: ₹${value}`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor || dataset.backgroundColor[i],
                index: i,
              };
            });
          },
        },
      },
    },
};
  return <Pie data={chartData} options={chartOptions} />;
};


/////////////////////////////////////////////////////
// 🟢 Bar Chart Component - Top Categories Spending
/////////////////////////////////////////////////////

export const SpendingBarChart = ({ data = {} }) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 5);  // Top 5
  const categories = sortedEntries.map(([cat]) => cat);
  const amounts = sortedEntries.map(([_, val]) => val);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: '₹ Spent',
        data: amounts,
        backgroundColor: '#42a5f5',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `₹ ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: value => `₹${value}`
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};


/////////////////////////////////////////////////////
// 🔴 Line Chart Component - Spending Over Time
/////////////////////////////////////////////////////

export const SpendingLineChart = ({ expenses = [] }) => {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

  // console.log(expenses);

  const labels = sortedExpenses.map(exp => exp.date?.slice(0, 10));
  const dataPoints = sortedExpenses.map(exp => exp.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: '₹ Spent',
        data: dataPoints,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: '#ff6384',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `₹ ${ctx.raw}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: val => `₹${val}`
        }
      }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
};
