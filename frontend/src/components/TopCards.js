import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Users, ArrowRight, TrendingUp } from "lucide-react";

export default function TopCards() {
  const [vacancies, setVacancies] = useState([]);
  const [appliedCounts, setAppliedCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hr/vacancies");
        const data = await res.json();
        setVacancies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch vacancies", err);
      }
    };

    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applications/count-per-vacancy");
        const data = await res.json();
        const countsMap = {};
        if (Array.isArray(data)) {
          data.forEach((item) => {
            countsMap[item._id] = item.appliedCount;
          });
        }
        setAppliedCounts(countsMap);
      } catch (err) {
        console.error("Failed to fetch application counts", err);
      }
    };

    fetchVacancies();
    fetchCounts();
  }, []);

  const totalApplications = Object.values(appliedCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Stats Header ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white px-8 py-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Active Pipeline</h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Real-time engagement</p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center md:text-right">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-0.5">Total Vacancies</span>
            <span className="text-2xl font-black text-gray-900">{vacancies.length}</span>
          </div>
          <div className="w-px h-10 bg-gray-100 hidden md:block" />
          <div className="text-center md:text-right">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">Applications</span>
            <div className="flex items-center gap-2 justify-center md:justify-end">
              <span className="text-2xl font-black text-gray-900">{totalApplications}</span>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Vacancy Grid ── */}
      {vacancies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vacancies.map((vac) => {
            const count = appliedCounts[vac._id] || 0;
            return (
              <div
                key={vac._id}
                onClick={() => navigate(`/hr/vacancies/${vac._id}/candidates`)}
                className="group cursor-pointer relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm
                           hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Users size={18} />
                </div>

                <div className="w-full space-y-1">
                  <h3 className="text-sm font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                    {vac.title}
                  </h3>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      <Building2 size={12} className="text-blue-400/50" /> {vac.company || "Darwinbox"}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      <MapPin size={12} className="text-indigo-400/50" /> {vac.location || "Remote"}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-50 mt-1" />

                <div className="w-full flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Applicants</span>
                    <span className="text-lg font-black text-gray-900">{count}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <span className="text-3xl grayscale opacity-30">📋</span>
          </div>
          <div className="text-center">
            <h3 className="text-gray-900 font-bold">No active positions</h3>
            <p className="text-gray-400 text-xs mt-1">Start by creating your first vacancy.</p>
          </div>
        </div>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Building2, MapPin, Users, ArrowRight } from "lucide-react";
 
// export default function TopCards() {
//   const [vacancies, setVacancies] = useState([]);
//   const [appliedCounts, setAppliedCounts] = useState({});
//   const navigate = useNavigate();
 
//   useEffect(() => {
//     // Fetch vacancies
//     const fetchVacancies = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/hr/vacancies");
//         const data = await res.json();
//         setVacancies(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch vacancies", err);
//       }
//     };
 
//     // Fetch applications count per vacancy
//     const fetchCounts = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:5000/api/applications/count-per-vacancy"
//         );
//         const data = await res.json();
 
//         const countsMap = {};
//         if (Array.isArray(data)) {
//           data.forEach((item) => {
//             if (item._id) {
//               const id = typeof item._id === 'object' ? item._id.$oid || item._id.toString() : item._id.toString();
//               countsMap[id] = {
//                 total: item.total || 0,
//                 pending: item.pending || 0,
//                 approved: item.approved || 0,
//                 rejected: item.rejected || 0
//               };
//             }
//           });
//         }
 
//         setAppliedCounts(countsMap);
//       } catch (err) {
//         console.error("Failed to fetch application counts", err);
//       }
//     };
 
//     fetchVacancies();
//     fetchCounts();
//   }, []);
 
//   return (
//     <div className="pb-10 px-6">
//       <div className="max-w-7xl mx-auto space-y-8">
 
//         {/* ── Header ── */}
//         <div className="flex items-end justify-between border-b border-gray-100 pb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
//               All Jobs Overview
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Monitoring applications across {vacancies.length} active position{vacancies.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//           <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
//             <div className="px-4 py-2 bg-blue-50 rounded-xl">
//               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Total Applications</span>
//               <span className="text-xl font-bold text-gray-800">
//                 {Object.values(appliedCounts).reduce((a, b) => a + (b.total || 0), 0)}
//               </span>
//             </div>
//           </div>
//         </div>
 
//         {vacancies.length ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {vacancies.map((vac) => (
//               <div
//                 key={vac._id}
//                 onClick={() => navigate(`/hr/vacancies/${vac._id}/candidates`)}
//                 className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-100 shadow-sm
//                            hover:shadow-md hover:-translate-y-0.5
//                            flex flex-col justify-between
//                            transition-all duration-200"
//               >
//                 <div className="mb-6 space-y-3">
//                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
//                     <Users size={20} />
//                   </div>
 
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition">
//                       {vac.title}
//                     </h3>
//                     <div className="flex flex-col gap-1">
//                       <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
//                         <Building2 size={11} className="text-blue-400" /> {vac.company}
//                       </span>
//                       <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
//                         <MapPin size={11} className="text-purple-400" /> {vac.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
 
//                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
//                   <div>
//                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-2">Applications</span>
//                     <div className="flex gap-3">
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Pnd</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.pending || 0}</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">App</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.approved || 0}</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Rej</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.rejected || 0}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                     <ArrowRight size={14} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-3xl border border-gray-100 border-dashed">
//             <span className="text-4xl">📋</span>
//             <p className="text-gray-400 text-sm italic">No vacancy data available.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Building2, MapPin, Users, ArrowRight } from "lucide-react";

// export default function TopCards() {
//   const [vacancies, setVacancies] = useState([]);
//   const [appliedCounts, setAppliedCounts] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVacancies = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/hr/vacancies");
//         const data = await res.json();
//         setVacancies(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch vacancies", err);
//       }
//     };

//     const fetchCounts = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/applications/count-per-vacancy");
//         const data = await res.json();

//         // transform counts into { vacancyId: { total, pending, approved, rejected } }
//         const countsMap = {};
//         if (Array.isArray(data)) {
//           data.forEach((item) => {
//             const id = typeof item._id === 'object' ? item._id.$oid || item._id.toString() : item._id.toString();
//             // initialize all statuses
//             countsMap[id] = { total: 0, pending: 0, approved: 0, rejected: 0 };
//             if (item.counts) {
//               // backend should return counts by status, e.g., { pending: 3, approved: 2, rejected: 1 }
//               countsMap[id].pending = item.counts.pending || 0;
//               countsMap[id].approved = item.counts.approved || 0;
//               countsMap[id].rejected = item.counts.rejected || 0;
//               countsMap[id].total = countsMap[id].pending + countsMap[id].approved + countsMap[id].rejected;
//             }
//           });
//         }

//         setAppliedCounts(countsMap);
//       } catch (err) {
//         console.error("Failed to fetch application counts", err);
//       }
//     };

//     fetchVacancies();
//     fetchCounts();
//   }, []);

//   return (
//     <div className="pb-10 px-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex items-end justify-between border-b border-gray-100 pb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
//               All Jobs Overview
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Monitoring applications across {vacancies.length} active position{vacancies.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//           <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
//             <div className="px-4 py-2 bg-blue-50 rounded-xl">
//               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Total Applications</span>
//               <span className="text-xl font-bold text-gray-800">
//                 {Object.values(appliedCounts).reduce((a, b) => a + (b.total || 0), 0)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {vacancies.length ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {vacancies.map((vac) => (
//               <div
//                 key={vac._id}
//                 onClick={() => navigate(`/hr/vacancies/${vac._id}/candidates`)}
//                 className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-100 shadow-sm
//                            hover:shadow-md hover:-translate-y-0.5
//                            flex flex-col justify-between
//                            transition-all duration-200"
//               >
//                 <div className="mb-6 space-y-3">
//                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
//                     <Users size={20} />
//                   </div>

//                   <div className="space-y-1">
//                     <h3 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition">
//                       {vac.title}
//                     </h3>
//                     <div className="flex flex-col gap-1">
//                       <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
//                         <Building2 size={11} className="text-blue-400" /> {vac.company}
//                       </span>
//                       <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
//                         <MapPin size={11} className="text-purple-400" /> {vac.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
//                   <div>
//                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-2">Applications</span>
//                     <div className="flex gap-3">
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Pnd</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.pending || 0}</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">App</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.approved || 0}</span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Rej</span>
//                         <span className="text-sm font-bold text-gray-700">{appliedCounts[vac._id]?.rejected || 0}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
//                     <ArrowRight size={14} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-3xl border border-gray-100 border-dashed">
//             <span className="text-4xl">📋</span>
//             <p className="text-gray-400 text-sm italic">No vacancy data available.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }