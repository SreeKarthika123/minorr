 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Sparkles } from "lucide-react";
 
export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
 
      const data = await res.json();
 
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (setUser) setUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-3 bg-white rounded-2xl shadow-sm border border-indigo-50 mb-4"
          >
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            {/* <span className="text-indigo-600 font-black tracking-widest text-[11px] uppercase block mb-1">
              Talent Intelligence
            </span> */}
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">Account</span>
            </h1>
          </motion.div>
        </div>
 
        {/* Signup Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl shadow-indigo-100/20">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
 
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
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
                Password
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
 
            {/* Signup Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 mt-4 py-4 px-6 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>
 
          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
 
        {/* Support Link */}
        {/* <p className="text-center mt-8 text-xs text-gray-400 font-medium">
          By signing up, you agree to our <a href="#" className="hover:text-gray-600 transition-colors underline underline-offset-2">Terms of Service</a>
        </p> */}
      </motion.div>
    </div>
  );
}
 