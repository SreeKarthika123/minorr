// import { Outlet } from "react-router-dom";
// import Sidebarhr from "../components/Sidebarhr";
// import HrTopbar from "../components/HrTopbar";
// import { useState } from "react";

// export default function HRLayout({setUser}) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100">

//       {/* ── Fixed Sidebar ── */}
//       {sidebarOpen && <Sidebarhr />}

//       <div className="flex-1 flex flex-col relative overflow-hidden">

//         {/* ── Fixed Topbar ── */}
//            <HrTopbar setSidebarOpen={setSidebarOpen} setUser={setUser} />
//             <main className="flex-1">
//         <Outlet context={{ setUser }} />
//       </main>
//         {/* <HrTopbar setSidebarOpen={setSidebarOpen} /> */}

//         {/* ── Scrollable Content area ── */}
//         <main className="flex-1 mt-20 px-8 pb-16 overflow-y-auto custom-scrollbar">

//           <div className="max-w-7xl mx-auto py-8">
//             <Outlet />
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Outlet } from "react-router-dom";
import HrTopbar from "../components/HrTopbar";
import Sidebarhr from "../components/Sidebarhr";

export default function HRLayout({ setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-100">

      {/* ── Sidebar ── */}
      {sidebarOpen && <Sidebarhr />}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* ── Topbar ── */}
        <HrTopbar setSidebarOpen={setSidebarOpen} setUser={setUser} />

        {/* ── Page Content ── */}
        <main className="flex-1 mt-20 px-8 pb-16 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto py-8">
            <Outlet context={{ setUser }} />
          </div>
        </main>
      </div>
    </div>
  );
}