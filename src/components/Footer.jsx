// frontend/src/components/Footer.jsx
import { BarChart3, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-ink text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <BarChart3 size={20} />
            </span>
            <span className="font-bold text-white">Pobreza y Hambre · MX</span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-400">
            Monitoreo de la pobreza y el hambre en tiempo real en Mexico, con ciencia de datos e imagenes satelitales.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Navegacion</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#inicio" className="hover:text-primary-light">Inicio</a></li>
            <li><a href="#acerca" className="hover:text-primary-light">Acerca de</a></li>
            <li><a href="#indicadores" className="hover:text-primary-light">Indicadores</a></li>
            <li><a href="#contacto" className="hover:text-primary-light">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Indicadores</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>Pobreza multidimensional</li>
            <li>Carencia alimentaria</li>
            <li>Inseguridad alimentaria</li>
            <li>Indicadores satelitales</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail size={16} className="text-primary-light" /> contacto@observatorio.mx</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-primary-light" /> +52 55 0000 0000</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-primary-light" /> Ciudad de Mexico</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Observatorio de Indicadores. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-light">Aviso de privacidad</a>
            <a href="#" className="hover:text-primary-light">Terminos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
