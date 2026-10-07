import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Products from './components/Products.jsx';
import Sales from './components/Sales.jsx';
import Forecast from './components/Forecast.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', view: Dashboard },
  { id: 'forecast', label: 'Forecast', view: Forecast },
  { id: 'sales', label: 'Sales Records', view: Sales },
  { id: 'products', label: 'Products', view: Products },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const View = TABS.find((t) => t.id === tab).view;

  return (
    <div className="app">
      <header className="topbar">
        <h1>📈 Sales Forecasting Dashboard</h1>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'tab active' : 'tab'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="content">
        <View key={tab} />
      </main>
    </div>
  );
}
