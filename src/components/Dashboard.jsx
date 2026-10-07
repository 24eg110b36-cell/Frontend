import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api, { inr, num } from '../api';

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/summary')
      .then((r) => setData(r.data))
      .catch(() => setError(`Cannot reach the backend at ${api.defaults.baseURL}. Is Spring Boot running?`));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <div className="cards">
        <Card title="Total Revenue" value={inr(data.totalRevenue)} />
        <Card title="Units Sold" value={num(data.totalUnits)} />
        <Card title="Sales Records" value={num(data.totalSales)} />
        <Card title="Products" value={num(data.productCount)} />
        <Card title="Top Product" value={data.topProduct} small />
      </div>

      <div className="panel">
        <h3>Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => (v / 100000).toFixed(0) + 'L'} />
            <Tooltip formatter={(v) => inr(v)} />
            <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis tickFormatter={(v) => (v / 100000).toFixed(0) + 'L'} />
              <Tooltip formatter={(v) => inr(v)} />
              <Bar dataKey="revenue" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.revenueByCategory} dataKey="revenue" nameKey="name" outerRadius={100} label>
                {data.revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function Card({ title, value, small }) {
  return (
    <div className="card">
      <span>{title}</span>
      <strong className={small ? 'small' : ''}>{value}</strong>
    </div>
  );
}
