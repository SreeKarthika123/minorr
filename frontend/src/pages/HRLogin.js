import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from "lucide-react";
 
export default function HRLogin({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  // Hardcoded HR credentials
  const HR_CREDENTIALS = {
    email: "hr@gmail.com",
    password: "hr123",
    role: "hr",
    name: "HR Admin",
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    // Simulate network delay for premium feel
    setTimeout(() => {
      if (email === HR_CREDENTIALS.email && password === HR_CREDENTIALS.password) {
        localStorage.setItem("user", JSON.stringify(HR_CREDENTIALS));
        if (setUser) setUser(HR_CREDENTIALS);
        navigate("/home");
      } else {
        setError("Invalid HR credentials. Please try again.");
      }
      setLoading(false);
    }, 800);
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements - Slightly different for HR to differentiate */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-[120px]" />
 
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-white rounded-2xl shadow-sm border border-indigo-50 mb-4"
          >
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            {/* <span className="text-indigo-600 font-black tracking-widest text-[11px] uppercase block mb-1">
              Admin Portal
            </span> */}
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">HR Login
            </h1>
          </motion.div>
        </div>
 
        {/* HR Login Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl shadow-indigo-100/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center"
              >
                {error}
              </motion.div>
            )}
 
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">
                HR Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="hr@talentintelligence.com"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
 
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">
                Access Code
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
 
            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </motion.button>
          </form>
 
 
        </div>
 
        {/* Back Link */}
        {/* <p className="text-center mt-8 text-xs text-gray-400 font-medium">
          Not an HR administrator? <Link to="/login" className="text-indigo-600 hover:underline">User Sign In</Link>
        </p> */}
      </motion.div>
    </div>
  );
}
 