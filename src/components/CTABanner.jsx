// frontend/src/components/CTABanner.jsx
import Button from './ui/Button.jsx';

export default function CTABanner() {
  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          ¿Necesitas mas informacion?
        </h2>
        <p className="mt-4 text-white/85 max-w-2xl mx-auto">
          Escribenos para conocer la metodologia, colaborar con el observatorio o solicitar
          acceso a los datos.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            arrow
            className="bg-white border-white"
            onClick={() => document.getElementById('contacto')?.scrollIntoView()}
          >
            Contactanos
          </Button>
        </div>
      </div>
    </section>
  );
}
