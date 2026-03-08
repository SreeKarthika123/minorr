import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  BriefcaseBusiness,
  Trophy,
  LogOut,
  ChevronRight,
  TrendingUp
} from "lucide-react";

const navItems = [
  { to: "/home", label: "Dashboard", Icon: LayoutDashboard, color: "#2563eb" },
  { to: "/create-job", label: "Create Job", Icon: FilePlus2, color: "#7c3aed" },
  { to: "/vacancies", label: "Vacancies", Icon: BriefcaseBusiness, color: "#0891b2" },
  { to: "/top-employees", label: "Top Employees", Icon: Trophy, color: "#d17a00" },
  { to: "/topcards", label: "All Jobs", Icon: BriefcaseBusiness, color: "#059669" },
  { to: "/analytics", label: "Analytics", Icon: TrendingUp, color: "#db2777" }
];

export default function Sidebarhr() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/hr-login");
  };

  return (
    <aside
      className="w-72 min-h-screen flex flex-col shrink-0 sticky top-0 bg-white border-r border-gray-200 z-40 shadow-sm"
    >
      {/* ── Brand ── */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white bg-blue-600 shadow-lg shadow-blue-200"
          >
            HR
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-gray-900">
              DarwinBox
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Manager Panel
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {navItems.map(({ to, label, Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200
               ${isActive
                ? "text-blue-600 bg-blue-50 border border-blue-100 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent"}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                    ${isActive ? "bg-white text-blue-600 shadow-sm" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-gray-900 group-hover:shadow-sm"}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <span className="flex-1">{label}</span>

                {isActive && <ChevronRight size={14} className="text-blue-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={logout}
          className="group w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold
                     text-rose-600 bg-rose-50 border border-rose-100
                     hover:bg-rose-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-rose-200"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
