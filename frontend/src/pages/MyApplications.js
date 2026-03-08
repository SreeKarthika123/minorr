import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Chatbot from "../components/Chatbot";
import { ClipboardList, Briefcase, Calendar, Clock, ChevronRight } from "lucide-react";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);

    const getUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?._id || user?.id || null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/applications/user/${userId}/applications`)
            .then(res => res.json())
            .then(data => {
                setApplications(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch applications error:", err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
            case "hired":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "rejected":
                return "bg-rose-50 text-rose-600 border-rose-100";
            default:
                return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <Topbar setSidebarOpen={setSidebarOpen} setChatOpen={setChatOpen} />

                <main className="p-8 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Applications</h1>
                            <p className="text-gray-500 text-sm mt-1">Track and manage your job application status.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <ClipboardList size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Applications</p>
                                <p className="text-lg font-bold text-gray-900">{applications.length}</p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading your applications...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Briefcase size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">No applications yet</h3>
                            <p className="text-gray-400 mt-2 max-w-xs text-center text-sm">
                                You haven't applied to any jobs yet. Start exploring opportunities in the vacancies section.
                            </p>
                            <button
                                onClick={() => window.location.href = "/vacancies"}
                                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Browse Vacancies
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Role</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {applications.map((app) => (
                                            <tr
                                                key={app._id}
                                                className="hover:bg-indigo-50/10 transition-colors group"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                            <Briefcase size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 leading-none">{app.vacancyId?.title || "N/A"}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">Ref: {app.vacancyId?._id?.slice(-6) || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/50">
                                                        {app.vacancyId?.department || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                                        <Clock size={12} className="mr-1.5" />
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group">
                                                        <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
                                <p className="text-xs text-gray-400 font-medium">Showing {applications.length} applications</p>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">Prev</button>
                                    <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100">1</button>
                                    <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">Next</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {chatOpen && (
                <Chatbot userId={getUserId()} onClose={() => setChatOpen(false)} />
            )}
        </div>
    );
};

export default MyApplications;
