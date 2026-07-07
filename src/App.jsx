// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import IndicadorDetalle from './pages/IndicadorDetalle.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/indicador/:tabla" element={<IndicadorDetalle />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
