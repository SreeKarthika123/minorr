import { Link, useLocation } from "react-router-dom";
import { UserCircle2, Briefcase, LayoutDashboard, ClipboardList } from "lucide-react";
import {useState , useEffect} from "react";
export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const [hasResume, setHasResume] = useState(
    localStorage.getItem("hasResume") === "true"
  );

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, enabled: true },
  { name: "Profile", path: "/profile", icon: UserCircle2, enabled: true },
  { name: "Recruitment", path: "/recruitment", icon: Briefcase, enabled: hasResume },
  { name: "Applications", path: "/applications", icon: ClipboardList, enabled: hasResume },
];
 useEffect(() => {
    const checkResume = () => {
      setHasResume(localStorage.getItem("hasResume") === "true");
    };

    window.addEventListener("storage", checkResume);

    // also check on mount
    checkResume();

    return () => window.removeEventListener("storage", checkResume);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-60 translate-x-0" : "w-60 -translate-x-full"}`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        {/* <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
        >
           {/* <LayoutDashboard size={16} color="white" />  */}
        {/* </div>  */}
        <span className="text-gray-800 font-bold text-base tracking-tight">
          Darwin<span className="text-indigo-500">Box</span>
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
     {menuItems.map(({ name, path, icon: Icon, enabled }) => {
          const isActive = location.pathname === path;
          return (
         <Link
  key={name}
  to={enabled ? path : "#"}
  onClick={(e) => {
    if (!enabled) {
      e.preventDefault();
      alert("Please upload your resume first 🚀");
    } else {
      setIsOpen(false);
    }
  }}
  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
    ${enabled
      ? isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      : "text-gray-300 cursor-not-allowed"
    }`}
>
              <div
                className={`w-1 h-5 rounded-full transition-all duration-200 -ml-1
                  ${isActive ? "bg-indigo-500 opacity-100" : "opacity-0"}`}
              />
              <Icon
                size={16}
                className={`transition-colors duration-200
                  ${isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}

    </div>
  );
}