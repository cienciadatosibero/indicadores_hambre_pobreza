// frontend/src/components/admin/AdminLogin.jsx
import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { api } from '../../lib/api.js';
import Button from '../ui/Button.jsx';

export default function AdminLogin({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(usuario, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', data.usuario);
      onLogin(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-300 pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-extrabold text-neutral-ink text-center">Panel de administracion</h1>
        <p className="text-sm text-neutral-text text-center mt-1 mb-6">Indicadores de Pobreza y Hambre</p>
        <div className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Usuario" className={inputCls} />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && entrar()} placeholder="Contrasena" className={inputCls} />
          </div>
          <Button onClick={entrar} disabled={loading} className="w-full justify-center">
            {loading ? 'Entrando...' : 'Iniciar sesion'}
          </Button>
          {error && <p className="text-sm text-primary text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
