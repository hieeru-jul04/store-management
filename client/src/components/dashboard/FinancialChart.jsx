import { useMemo } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/format'

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
)

export function FinancialChart({ orders, filterType, dateValue }) {
  const chartData = useMemo(() => {
    if (!dateValue) return { labels: [], datasets: [] }

    let groupedData = []

    if (filterType === 'day') {
      // 24 hours
      groupedData = Array.from({ length: 24 }, (_, i) => ({
        name: `${i}h`,
        revenue: 0,
        profit: 0,
      }))

      orders.forEach((o) => {
        const date = new Date(o.createdAt)
        const hour = date.getHours()
        groupedData[hour].revenue += o.total
        groupedData[hour].profit += o.actualProfit || 0
      })
    } else if (filterType === 'month') {
      // Days in month
      const [year, month] = dateValue.split('-')
      const daysInMonth = new Date(year, month, 0).getDate()
      groupedData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        revenue: 0,
        profit: 0,
      }))

      orders.forEach((o) => {
        const date = new Date(o.createdAt)
        const day = date.getDate() - 1 // 0-indexed
        groupedData[day].revenue += o.total
        groupedData[day].profit += o.actualProfit || 0
      })
    } else if (filterType === 'year') {
      // 12 months
      groupedData = Array.from({ length: 12 }, (_, i) => ({
        name: `T${i + 1}`,
        revenue: 0,
        profit: 0,
      }))

      orders.forEach((o) => {
        const date = new Date(o.createdAt)
        const month = date.getMonth() // 0-indexed
        groupedData[month].revenue += o.total
        groupedData[month].profit += o.actualProfit || 0
      })
    }

    const labels = groupedData.map((d) => d.name)
    const revenues = groupedData.map((d) => d.revenue)
    const profits = groupedData.map((d) => d.profit)

    return {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Lợi nhuận',
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          borderWidth: 3,
          data: profits,
          tension: 0.3,
          pointRadius: 3,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Doanh thu',
          backgroundColor: '#3b82f6',
          data: revenues,
          borderRadius: 4,
          maxBarThickness: 40,
          yAxisID: 'y',
        },
      ],
    }
  }, [orders, filterType, dateValue])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y)
            }
            return label
          },
        },
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
          callback: function (value) {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
            return value
          },
        },
      },
    },
  }

  return (
    <div className="h-[350px] w-full">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  )
}
