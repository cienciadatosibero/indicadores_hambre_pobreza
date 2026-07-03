// frontend/src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Database, Settings, Mail, LogOut, BarChart3, MapPin } from 'lucide-react';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import UploadTable from '../components/admin/UploadTable.jsx';
import TablesManager from '../components/admin/TablesManager.jsx';
import IndicatorConfig from '../components/admin/IndicatorConfig.jsx';
import MessagesInbox from '../components/admin/MessagesInbox.jsx';
import MunicipiosCatalog from '../components/admin/MunicipiosCatalog.jsx';
import { getToken } from '../lib/api.js';

const TABS = [
  { id: 'upload', label: 'Cargar datos', icon: Upload },
  { id: 'tablas', label: 'Tablas', icon: Database },
  { id: 'config', label: 'Indicadores', icon: Settings },
  { id: 'mensajes', label: 'Mensajes', icon: Mail },
  { id: 'municipios', label: 'Municipios', icon: MapPin },
];

export default function AdminDashboard() {
  const [auth, setAuth] = useState(!!getToken());
  const [tab, setTab] = useState('upload');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)} />;

  function salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setAuth(false);
    navigate('/');
  }

  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <BarChart3 size={20} />
            </span>
            <span className="font-bold text-neutral-ink">Panel de administracion</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm text-neutral-text hover:text-primary">Ver sitio</button>
            <button onClick={salir} className="flex items-center gap-1 text-sm text-primary font-semibold">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                tab === t.id ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-text hover:shadow-sm border border-neutral-200'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {tab === 'upload' && <UploadTable onDone={bump} />}
          {tab === 'tablas' && <TablesManager refreshKey={refreshKey} />}
          {tab === 'config' && <IndicatorConfig refreshKey={refreshKey} onSaved={bump} />}
          {tab === 'mensajes' && <MessagesInbox />}
          {tab === 'municipios' && <MunicipiosCatalog />}
        </div>
      </div>
    </div>
  );
}
