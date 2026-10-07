import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import api, { inr, num } from '../api';

export default function Forecast() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [months, setMonths] = useState(6);
  const [metric, setMetric] = useState('revenue');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setError('');
    api.get('/forecast', { params: { productId: productId || undefined, months } })
      .then((r) => setResult(r.data))
      .catch(() => setError(`Cannot reach the backend at ${api.defaults.baseURL}. Is Spring Boot running?`));
  }, [productId, months]);

  const points = result?.points || [];
  const lastActual = points.map((p) => p.forecast).lastIndexOf(false);
  const chartData = points.map((p, i) => ({
    month: p.month,
    actual: p.forecast ? null : p[metric],
    forecast: p.forecast || i === lastActual ? p[metric] : null, // joins the two lines
  }));
  const future = points.filter((p) => p.forecast);
  const fmt = metric === 'revenue' ? inr : num;

  return (
    <>
      <div className="panel toolbar">
        <label>Product
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">All products</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>Months ahead
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            {[3, 6, 9, 12].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>Metric
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="revenue">Revenue (₹)</option>
            <option value="units">Units sold</option>
          </select>
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="panel">
        <h3>Actual vs Forecast {result?.model && <small className="muted"> — model: {result.model}</small>}</h3>
        {points.length === 0 ? <p>No sales data yet.</p> : (
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => (metric === 'revenue' ? (v / 100000).toFixed(0) + 'L' : v)} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" strokeWidth={2} dot={false} connectNulls />
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {future.length > 0 && (
        <div className="panel">
          <h3>Predicted values</h3>
          <table>
            <thead><tr><th>Month</th><th>Units</th><th>Revenue</th></tr></thead>
            <tbody>
              {future.map((p) => (
                <tr key={p.month}><td>{p.month}</td><td>{num(p.units)}</td><td>{inr(p.revenue)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
