// frontend/src/components/Contact.jsx
import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { api } from '../lib/api.js';
import SectionTitle from './ui/SectionTitle.jsx';
import Button from './ui/Button.jsx';

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [estado, setEstado] = useState({ tipo: null, msg: '' });
  const [enviando, setEnviando] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar() {
    setEnviando(true);
    setEstado({ tipo: null, msg: '' });
    try {
      await api.contacto(form);
      setEstado({ tipo: 'ok', msg: 'Mensaje enviado correctamente. Gracias por escribirnos.' });
      setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
    } catch (e) {
      setEstado({ tipo: 'error', msg: e.message });
    } finally {
      setEnviando(false);
    }
  }

  const inputCls = 'w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <section id="contacto" className="py-20 md:py-28 bg-neutral-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <SectionTitle eyebrow="Contacto" title="Ponte en contacto con el observatorio" />
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail size={20} /></span>
              <div><p className="text-sm text-neutral-text">Correo</p><p className="font-medium text-neutral-ink">contacto@observatorio.mx</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Phone size={20} /></span>
              <div><p className="text-sm text-neutral-text">Telefono</p><p className="font-medium text-neutral-ink">+52 55 0000 0000</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin size={20} /></span>
              <div><p className="text-sm text-neutral-text">Ubicacion</p><p className="font-medium text-neutral-ink">Ciudad de Mexico, Mexico</p></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <input name="nombre" value={form.nombre} onChange={handle} placeholder="Nombre completo" className={inputCls} />
            <input name="correo" type="email" value={form.correo} onChange={handle} placeholder="Correo electronico" className={inputCls} />
            <input name="asunto" value={form.asunto} onChange={handle} placeholder="Asunto" className={inputCls} />
            <textarea name="mensaje" value={form.mensaje} onChange={handle} placeholder="Tu mensaje" rows={5} className={inputCls} />
            <Button onClick={enviar} disabled={enviando} className="w-full justify-center">
              <Send size={16} /> {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </Button>
            {estado.tipo && (
              <p className={`text-sm ${estado.tipo === 'ok' ? 'text-[#1A9641]' : 'text-primary'}`}>{estado.msg}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
