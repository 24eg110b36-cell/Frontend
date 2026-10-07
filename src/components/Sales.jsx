import { useEffect, useState } from 'react';
import api, { inr, num } from '../api';

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({ productId: '', saleDate: today(), quantity: '', amount: '' });

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const PAGE = 15;

  const load = () => {
    api.get('/sales').then((r) => setSales(r.data)).catch(() => setError('Cannot reach the backend.'));
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = {
        productId: Number(form.productId),
        saleDate: form.saleDate,
        quantity: Number(form.quantity),
        amount: form.amount ? Number(form.amount) : null,
      };
      if (editId) await api.put(`/sales/${editId}`, body);
      else await api.post('/sales', body);
      setForm(emptyForm());
      setEditId(null);
      load();
    } catch {
      setError('Could not save the sale. Check the values.');
    }
  };

  const edit = (s) => {
    setEditId(s.id);
    setForm({ productId: s.product.id, saleDate: s.saleDate, quantity: s.quantity, amount: s.amount });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (s) => {
    if (!window.confirm('Delete this sales record?')) return;
    await api.delete(`/sales/${s.id}`);
    load();
  };

  const pages = Math.max(1, Math.ceil(sales.length / PAGE));
  const rows = sales.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <>
      <form className="panel form" onSubmit={submit}>
        <h3>{editId ? 'Edit sale' : 'Add sale'}</h3>
        <select name="productId" value={form.productId} onChange={change} required>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input name="saleDate" type="date" value={form.saleDate} onChange={change} required />
        <input name="quantity" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={change} required />
        <input name="amount" type="number" min="0" step="0.01" placeholder="Amount (blank = price × qty)" value={form.amount} onChange={change} />
        <button className="primary" type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyForm()); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <table>
          <thead><tr><th>Date</th><th>Product</th><th>Category</th><th>Qty</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>{s.saleDate}</td><td>{s.product.name}</td><td>{s.product.category}</td>
                <td>{num(s.quantity)}</td><td>{inr(s.amount)}</td>
                <td className="actions">
                  <button onClick={() => edit(s)}>Edit</button>
                  <button className="danger" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pager">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page + 1} of {pages}</span>
          <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}
