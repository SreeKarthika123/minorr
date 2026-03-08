import { useEffect, useState } from "react";
import { Building2, MapPin, Trash2 } from "lucide-react";

/* ── Confirm modal ── */
function ConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-2xl p-7 w-80 text-center shadow-2xl border border-red-100 space-y-4">
        <div className="text-4xl">🗑️</div>
        <p className="text-gray-800 font-semibold">Delete Vacancy?</p>
        <p className="text-gray-500 text-sm">
          "<span className="text-red-500 font-medium">{title}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/hr/vacancies")
      .then((r) => r.json())
      .then((d) => setVacancies(Array.isArray(d) ? d : []))
      .catch(() => setVacancies([]));
  }, []);

  const handleDelete = () => {
    if (!confirmId) return;
    fetch(`http://localhost:5000/api/hr/vacancies/${confirmId}`, { method: "DELETE" })
      .then((r) => { if (r.ok) setVacancies((p) => p.filter((v) => v._id !== confirmId)); })
      .catch(console.error)
      .finally(() => setConfirmId(null));
  };

  const confirmVac = vacancies.find((v) => v._id === confirmId);

  return (
    <div
      className="min-h-screen px-6 md:px-10 py-12"
      style={{ background: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 60%,#e0f2fe 100%)" }}
    >
      {/* Subtle blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle,#bfdbfe,transparent)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#ddd6fe,transparent)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Available Vacancies
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {vacancies.length} active posting{vacancies.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gray-200" />

        {/* ── Grid ── */}
        {vacancies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {vacancies.map((vac) => (
              <div
                key={vac._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm
                           hover:shadow-md hover:-translate-y-0.5
                           flex flex-col justify-between p-5
                           transition-all duration-200"
              >
                {/* Top info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 leading-snug">
                    {vac.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {vac.company && (
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Building2 size={11} /> {vac.company}
                      </span>
                    )}
                    {vac.location && (
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <MapPin size={11} /> {vac.location}
                      </span>
                    )}
                  </div>
                  {vac.department && (
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium
                                     bg-violet-50 border border-violet-200 text-violet-600">
                      {vac.department}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-4" />

                {/* Delete */}
                <button
                  onClick={() => setConfirmId(vac._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold
                             bg-red-50 border border-red-100 text-red-500
                             hover:bg-red-100 hover:border-red-200 transition-all duration-200"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-50">
            <span className="text-5xl">📋</span>
            <p className="text-gray-400 text-sm italic">No vacancies posted yet.</p>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmId && (
        <ConfirmModal
          title={confirmVac?.title || "this vacancy"}
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}