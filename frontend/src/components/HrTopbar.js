// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, Menu, ChevronDown, LogOut, MessageSquareText, Search } from "lucide-react";
// import HRChatbot from "./HRChatbot.js";
// export default function HrTopbar({ setSidebarOpen, setUser }) {
// // export default function HrTopbar({ setSidebarOpen }) {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [showHrBot, setShowHrBot] = useState(false);

//   const dropdownRef = useRef(null);
//   const notifRef = useRef(null);

//   let user = null;
//   try {
//     const stored = localStorage.getItem("user");
//     if (stored && stored !== "undefined") user = JSON.parse(stored);
//   } catch { user = null; }

//   const userId = user?._id || user?.id;

//   useEffect(() => {
//     if (!userId) return;
//     fetch(`http://localhost:5000/api/notifications/user/${userId}`)
//       .then((r) => r.json())
//       .then((d) => setNotifications(Array.isArray(d) ? d : []))
//       .catch(() => { });
//   }, [userId]);

//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
//       if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const initials = (user?.name || "HR").charAt(0).toUpperCase();
//   const unread = notifications.filter((n) => !n.read).length;

//   return (
//     <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-gray-200 shadow-sm z-30 sticky top-0">

//       {/* ── Left: Search ── */}
//       <div className="flex items-center gap-6 flex-1 max-w-xl">
//         <button
//           onClick={() => setSidebarOpen(p => !p)}
//           className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
//         >
//           <Menu size={20} />
//         </button>
//         <div className="relative w-full group">
//           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//           <input
//             type="text"
//             placeholder="Search candidates or jobs..."
//             className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 
//                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white 
//                        placeholder:text-gray-400 transition-all shadow-inner"
//           />
//         </div>
//       </div>

//       {/* ── Right: Actions ── */}
//       <div className="flex items-center gap-5">

//         {/* HR Assist */}
//         <button
//           onClick={() => setShowHrBot(!showHrBot)}
//           className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300
//             ${showHrBot
//               ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//               : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
//             }`}
//         >
//           <MessageSquareText size={16} className={showHrBot ? "animate-pulse" : ""} />
//           <span>HR Assist</span>
//         </button>

//         {/* Notifications */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
//           >
//             <Bell size={19} />
//             {unread > 0 && (
//               <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm" />
//             )}
//           </button>

//           {showNotifications && (
//             <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-3xl shadow-xl py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//               <div className="flex items-center justify-between px-6 pb-3 border-b border-gray-50">
//                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Notifications</h3>
//                 {unread > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unread} new</span>}
//               </div>
//               <div className="max-h-72 overflow-y-auto px-2 mt-2 custom-scrollbar">
//                 {notifications.length === 0 ? (
//                   <div className="py-10 text-center text-gray-400 italic text-sm">No new alerts.</div>
//                 ) : (
//                   notifications.map((n) => (
//                     <div key={n._id} className="p-4 rounded-2xl hover:bg-gray-50 transition cursor-default">
//                       <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
//                       {n.vacancyId?.title && (
//                         <p className="text-[11px] text-blue-600 font-bold mt-1.5 uppercase tracking-wide">Role: {n.vacancyId.title}</p>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Profile */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm transition-all"
//           >
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
//               {initials}
//             </div>
//             <div className="hidden sm:block text-left">
//               <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || "HR Manager"}</p>
//               <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Verified HR</p>
//             </div>
//             <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//               <button
//                 onClick={() => { localStorage.removeItem("user");
//                    setUser(null);  navigate("/login"); }}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
//               >
//                 <LogOut size={16} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {showHrBot && (
//         <div className="fixed bottom-10 right-10 z-50">
//           <HRChatbot userId={userId} onClose={() => setShowHrBot(false)} />
//         </div>
//       )}
//     </header>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, ChevronDown, User, LogOut, MessageSquareText } from "lucide-react";
 
 
 
export default function HrTopbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
 
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
 
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") user = JSON.parse(stored);
  } catch { user = null; }
 
  /* ── Fetch notifications ── */
  const userId = user?._id || user?.id;
  useEffect(() => {
    if (!userId) return;
 
    const getNotifs = () => {
      fetch(`http://localhost:5000/api/notifications/user/${userId}`)
        .then((r) => r.json())
        .then((d) => setNotifications(Array.isArray(d) ? d : []))
        .catch(() => { });
    };
 
    getNotifs();
    const interval = setInterval(getNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [userId]);
 
  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const initials = (user?.name || "HR").charAt(0).toUpperCase();
  const unread = notifications.filter((n) => !n.read).length;
 
 
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3
                 bg-white border-b border-gray-100"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}
    >
      {/* ── Left: toggle + title ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </button>
 
        <h2 className="text-base font-bold text-gray-800 hidden sm:block">
          HR Dashboard
        </h2>
      </div>
 
      {/* ── Right ── */}
      <div className="flex items-center gap-3">
 
        {/* Welcome pill */}
        <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-400
                         bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          👋 <span className="text-gray-700 font-medium">{user?.name || "HR"}</span>
        </span>
 
        {/* ── Notification bell ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((p) => !p)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl
                       text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
 
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white border border-gray-100
                         rounded-2xl shadow-xl py-2 z-50"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                  Notifications
                </h3>
                {unread > 0 && (
                  <span className="text-[10px] bg-red-50 text-red-500 border border-red-100
                                   px-2 py-0.5 rounded-full font-medium">
                    {unread} new
                  </span>
                )}
              </div>
 
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id}
                      className="px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                      <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                      {n.vacancyId?.title && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Job: {n.vacancyId.title}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
 
 
        {/* ── Profile dropdown ── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                       hover:bg-gray-100 transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
            >
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[90px] truncate">
              {user?.name || "HR"}
            </span>
            <ChevronDown
              size={13}
              color="#9ca3af"
              className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
 
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100
                            rounded-2xl shadow-xl py-1.5 z-50">
 
              <div className="my-1 mx-3 h-px bg-gray-100" />
              <button
                onClick={() => { localStorage.removeItem("user"); window.location.href = "/login"; }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                           text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={14} color="#f43f5e" /> Logout
              </button>
            </div>
          )}
        </div>
 
      </div>
    </header>
  );
}