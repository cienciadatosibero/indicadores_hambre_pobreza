// frontend/src/components/admin/ColumnTypePicker.jsx
const TIPOS = ['INT', 'DECIMAL', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN'];

// columnas: [{ original, safe, tipo, esId }]
export default function ColumnTypePicker({ columnas, setColumnas }) {
  function setTipo(safe, tipo) {
    setColumnas(columnas.map((c) => (c.safe === safe ? { ...c, tipo } : c)));
  }
  function setId(safe) {
    setColumnas(columnas.map((c) => ({ ...c, esId: c.safe === safe })));
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-bg text-neutral-ink">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Columna (original)</th>
            <th className="px-4 py-3 text-left font-semibold">Nombre en BD</th>
            <th className="px-4 py-3 text-left font-semibold">Tipo de dato</th>
            <th className="px-4 py-3 text-center font-semibold">Es ID (PK)</th>
          </tr>
        </thead>
        <tbody>
          {columnas.map((c) => (
            <tr key={c.safe} className="border-t border-neutral-200">
              <td className="px-4 py-3 text-neutral-ink">{c.original}</td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-text">{c.safe}</td>
              <td className="px-4 py-3">
                <select
                  value={c.tipo}
                  onChange={(e) => setTipo(c.safe, e.target.value)}
                  className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                >
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="radio"
                  name="idCol"
                  checked={!!c.esId}
                  onChange={() => setId(c.safe)}
                  className="accent-primary h-4 w-4"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
