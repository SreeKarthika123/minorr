import { apiFetch } from "../utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Chatbot from "./Chatbot";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || user?.id || user?.user?._id || null;
  } catch {
    return null;
  }
};
const openUser = (id) => {
  navigate(`/users/${id}`);
};




const calculateProfileStrength = ({
  user,
  appliedJobs,
  matchCount,
  totalJobs,
  progress,
}) => {
  let score = 0;

  // 1️⃣ Basic profile (30)
  if (user?.name) score += 6;
  if (user?.email) score += 1;
  if (user?.phone) score += 6;
  if (user?.designation) score += 6;
  if (user?.skills?.length > 0) score += 6;

  // 2️⃣ Resume & ATS (30)
  if (user?.resume) score += 10;
  if (progress?.status === "completed") score += 10;
  if (matchCount > 0) score += 10;

  // 3️⃣ Skills depth (20)
  if (user?.skills?.length >= 3) score += 10;
  if (user?.skills?.length >= 6) score += 15;

  // 4️⃣ Activity (10)
  if (appliedJobs.length > 0) score += 5;
  if (appliedJobs.length >= 3) score += 5;

  // 5️⃣ Match relevance (10)
  if (totalJobs > 0 && matchCount > 0) {
    const ratio = matchCount / totalJobs;
    if (ratio >= 0.5) score += 10;
    else if (ratio >= 0.25) score += 5;
  }

  return Math.min(score, 100);
};

export default function Dashboard() {
  const [matchCount, setMatchCount] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [progress, setProgress] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const userId = getUserId();

  const loadATSMatches = async () => {
    try {
      const res = await apiFetch(`/api/ats/dashboard-matches/${userId}`);
      const data = await res.json();
      setMatchCount(data.count || 0);
    } catch (err) {
      console.error("Dashboard ATS match error:", err);
    }
  };



 useEffect(() => {
    const user = getUserId;

    if (!user || user.role === "hr") {
      navigate("/login");
    }
  }, []);


  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hr/vacancies`);
        const data = await res.json();
        setVacancies(data || []);
      } catch (err) {
        console.error("Failed to fetch vacancies", err);
        setVacancies([]);
      }
    };
    fetchVacancies();
  }, []);


  useEffect(() => {
  if (!userId) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/profile/${userId}`
      );
      const data = await res.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  fetchProfile();
}, [userId]);
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/applications/user/${userId}`);
        const data = await res.json();
        setAppliedJobs(data.map((app) => app.vacancyId));
      } catch (err) {
        console.error("Failed to fetch applied jobs", err);
        setAppliedJobs([]);
      }
    };
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch(`/api/notifications/user/${userId}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Notification fetch error", err);
      }
    };
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const fetchTotalJobs = async () => {
      try {
        const res = await apiFetch("/api/ai/jobs-count");
        const data = await res.json();
        setTotalJobs(data.total || 0);
      } catch (err) {
        console.error("Failed to fetch total jobs", err);
      }
    };
    fetchTotalJobs();
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadATSMatches();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch(`/api/ai/analysis-progress/${userId}`);
        const data = await res.json();
        setProgress(data);
        setIsAnalyzing(data.status === "analyzing");
        if (data.status === "completed") {
          await loadATSMatches();
        }
      } catch (err) {
        console.error("Progress fetch error:", err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [userId]);

 const profileStrength = userProfile
  ? calculateProfileStrength({
      user: userProfile,
      appliedJobs,
      matchCount,
      totalJobs,
      progress,
    })
  : 0;

  const strengthLabel =
  profileStrength < 30
    ? "Weak"
    : profileStrength < 60
    ? "Average"
    : profileStrength < 80
    ? "Strong"
    : "Excellent";
  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"}`}>
        <Topbar
  setSidebarOpen={setSidebarOpen}
  setChatOpen={setChatOpen}
/>
        {/* <Topbar setSidebarOpen={setSidebarOpen} /> */}

        <div className="px-8 pt-8 pb-10 space-y-6">

          

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Matched Jobs" value={matchCount} accent="green" />
            <StatCard title="Applied Jobs" value={appliedJobs.length} accent="blue" />
            <StatCard title="Total Vacancies" value={totalJobs} accent="yellow" />
            <StatCard
  title="Profile Strength"
  value={`${profileStrength}%`}
  subtitle={strengthLabel}
  accent="purple"
/>
            {/* <StatCard title="Profile Strength" value={profileStrength} accent="purple" /> */}
          </div>

          {/* ── Analysis Progress ── */}
          {isAnalyzing && progress && (
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
              <h2 className="text-base font-semibold text-amber-600 flex items-center gap-2">
                ⏳ Resume Analysis in Progress
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {progress.analyzed} / {progress.total} jobs analyzed
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((progress.analyzed / progress.total) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Match Result Banner ── */}
      {/* ── Match Result Banner (HIGHLIGHTED) ── */}
{!isAnalyzing && matchCount > 0 && (
  <div
    className="rounded-2xl p-6 shadow-lg
               border border-emerald-400
               bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100"
  >
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          🎯 {matchCount} Job Matches Found
        </h2>
        <p className="text-sm text-emerald-700 mt-1">
          High-confidence opportunities tailored for your profile
        </p>
      </div>

      <button
        onClick={() => navigate("/recruitment?matched=true")}
        className="px-5 py-2 rounded-xl
                   bg-emerald-600 text-white text-sm font-semibold
                   hover:bg-emerald-700
                   transition-all duration-200 shadow-md"
      >
        View Matches →
      </button>
    </div>
  </div>
)}

          {/* ── Welcome Card ── */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
              >
                🚀
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Welcome Back!</h2>
                <p className="text-sm text-gray-400">
                  Track your resume performance and unlock better opportunities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating Chatbot Button ── */}
      {/* <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full
                   bg-indigo-600 hover:bg-indigo-700 text-white
                   shadow-lg flex items-center justify-center text-2xl z-40
                   transition-all duration-200 hover:scale-105"
        title="Open Chatbot"
      >
        💬
      </button> */}

      {chatOpen && (
        <Chatbot userId={userId} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
