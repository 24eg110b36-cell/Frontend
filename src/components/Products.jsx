import { useEffect, useState } from 'react';
import api, { inr } from '../api';

const empty = { name: '', category: 'Laptop', price: '' };

export default function Products() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/products').then((r) => setList(r.data)).catch(() => setError('Cannot reach the backend.'));
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { ...form, price: Number(form.price) };
      if (editId) await api.put(`/products/${editId}`, body);
      else await api.post('/products', body);
      setForm(empty);
      setEditId(null);
      load();
    } catch {
      setError('Could not save the product. Check the values.');
    }
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category || '', price: p.price });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}" and all of its sales records?`)) return;
    await api.delete(`/products/${p.id}`);
    load();
  };

  return (
    <>
      <form className="panel form" onSubmit={submit}>
        <h3>{editId ? 'Edit product' : 'Add product'}</h3>
        <input name="name" placeholder="Product name" value={form.name} onChange={change} required />
        <input name="category" list="cats" placeholder="Category" value={form.category} onChange={change} />
        <datalist id="cats"><option value="Laptop" /><option value="Mobile" /></datalist>
        <input name="price" type="number" min="1" step="0.01" placeholder="Price (₹)" value={form.price} onChange={change} required />
        <button className="primary" type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>
      {error && <div className="error">{error}</div>}
      <div className="panel">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th></th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>{inr(p.price)}</td>
                <td className="actions">
                  <button onClick={() => edit(p)}>Edit</button>
                  <button className="danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
