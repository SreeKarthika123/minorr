// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login({ setUser }) {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();


//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

// //     const data = await res.json();
// //     console.log("🔵 FULL LOGIN RESPONSE:", data);
// //     console.log("🔵 accessToken:", data.accessToken);
// //     console.log("🔵 refreshToken:", data.refreshToken);

// //     if (res.ok) {
// //       localStorage.setItem("accessToken", data.accessToken);
// //       localStorage.setItem("refreshToken", data.refreshToken);

// //       console.log(
// //         "🟢 STORED accessToken:",
// //         localStorage.getItem("accessToken")
// //       );
// //       console.log(
// //         "🟢 STORED refreshToken:",
// //         localStorage.getItem("refreshToken")
// //       );
// //       localStorage.setItem("user", JSON.stringify(data.user)); // save in storage
// //       setUser(data.user); // update App.js state
// //       navigate("/dashboard"); // navigate to dashboard
// //     } else {
// //       alert(data.message);
// //     }
// //   };


// //   return (
// //     <div className="min-h-screen flex items-center justify-center 
// //                   bg-gradient-to-br from-[#0b1020] via-[#0e1630] to-black 
// //                   text-gray-200">

// //       {/* Card */}
// //       <form
// //         onSubmit={handleLogin}
// //         className="relative w-96 p-8 rounded-2xl
// //                  bg-white/5 backdrop-blur-xl
// //                  border border-white/10
// //                  shadow-2xl
// //                  hover:shadow-blue-500/20
// //                  transition-all duration-300
// //                  hover:scale-[1.02]"
// //       >
// //         {/* Glow */}
// //         <div className="absolute -inset-1 rounded-2xl 
// //                       bg-gradient-to-r from-blue-500/20 to-purple-500/20 
// //                       blur opacity-30 -z-10" />

// //         <h2 className="text-3xl font-bold mb-2 text-center">
// //           Welcome Back 👋
// //         </h2>
// //         <p className="text-sm text-gray-400 text-center mb-6">
// //           Login to access your dashboard
// //         </p>

// //         {/* Email */}
// //         <div className="mb-4">
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             className="w-full px-4 py-3 rounded-lg
// //                      bg-black/40 border border-white/10
// //                      text-gray-200 placeholder-gray-400
// //                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
// //                      transition-all"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>

// //         {/* Password */}
// //         <div className="mb-6">
// //           <input
// //             type="password"
// //             placeholder="Password"
// //             className="w-full px-4 py-3 rounded-lg
// //                      bg-black/40 border border-white/10
// //                      text-gray-200 placeholder-gray-400
// //                      focus:outline-none focus:ring-2 focus:ring-purple-500/50
// //                      transition-all"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //         </div>

// //         {/* Button */}
// //         <button
// //           type="submit"
// //           className="w-full py-3 rounded-xl font-semibold
// //                    bg-gradient-to-r from-blue-600 to-purple-600
// //                    hover:from-blue-500 hover:to-purple-500
// //                    transition-all duration-300
// //                    hover:shadow-lg hover:shadow-blue-500/30
// //                    active:scale-95"
// //         >
// //           Login
// //         </button>

// //         {/* Signup */}
// //         <p className="text-sm text-gray-400 text-center mt-6">
// //           Don’t have an account?{" "}
// //           <Link
// //             to="/signup"
// //             className="text-blue-400 hover:text-blue-300 hover:underline transition"
// //           >
// //             Signup
// //           </Link>
// //         </p>
// //       </form>
// //     </div>
// //   );
// // }
// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // //       <form
// // //         onSubmit={handleLogin}
// // //         className="bg-white p-8 rounded-lg shadow w-96"
// // //       >
// // //         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

// // //         <input
// // //           type="email"
// // //           placeholder="Email"
// // //           className="w-full border px-4 py-2 rounded mb-4"
// // //           value={email}
// // //           onChange={(e) => setEmail(e.target.value)}
// // //           required
// // //         />

// // //         <input
// // //           type="password"
// // //           placeholder="Password"
// // //           className="w-full border px-4 py-2 rounded mb-4"
// // //           value={password}
// // //           onChange={(e) => setPassword(e.target.value)}
// // //           required
// // //         />

// // //         <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4">
// // //           Login
// // //         </button>

// // //         <p className="text-sm text-gray-500 text-center">
// // //           Don't have an account?{" "}
// // //           <Link to="/signup" className="text-blue-600 hover:underline">
// // //             Signup
// // //           </Link>
// // //         </p>
// // //       </form>
// // //     </div>
// // //   );
// // // }



// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login({ setUser }) {
//   const navigate = useNavigate();
//   const [tab, setTab] = useState("user"); // "user" or "hr"

//   // Common states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Hardcoded HR credentials
//   const HR_CREDENTIALS = {
//     email: "hr@gmail.com",
//     password: "hr123",
//     role: "hr",
//     name: "HR Admin",
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (tab === "hr") {
//       // HR login
//       if (email === HR_CREDENTIALS.email && password === HR_CREDENTIALS.password) {
//         localStorage.setItem("user", JSON.stringify(HR_CREDENTIALS));
//         setUser(HR_CREDENTIALS);
//         navigate("/home"); // HR dashboard
//       } else {
//         setError("Invalid HR email or password");
//       }
//     } else {
//       // Regular user login
//       try {
//         const res = await fetch("http://localhost:5000/api/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         });

//         const data = await res.json();

//         if (res.ok) {
//           localStorage.setItem("accessToken", data.accessToken);
//           localStorage.setItem("refreshToken", data.refreshToken);
//           localStorage.setItem("user", JSON.stringify(data.user));
//           setUser(data.user);
//           navigate("/dashboard"); // user dashboard
//         } else {
//           setError(data.message || "Login failed");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Network error. Try again.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8">

//         {/* Tab switch */}
//         <div className="flex justify-center mb-6 gap-4">
//           <button
//             className={`px-4 py-2 rounded-lg font-semibold transition ${tab === "user"
//                 ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//               }`}
//             onClick={() => setTab("user")}
//           >
//             User Login
//           </button>
//           <button
//             className={`px-4 py-2 rounded-lg font-semibold transition ${tab === "hr"
//                 ? "bg-purple-600 text-white shadow-md shadow-purple-200"
//                 : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//               }`}
//             onClick={() => setTab("hr")}
//           >
//             HR Login
//           </button>
//         </div>

//         <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
//           {tab === "user" ? "Welcome Back 👋" : "HR Login"}
//         </h2>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           {tab === "user"
//             ? "Login to access your dashboard"
//             : "Enter your HR credentials"}
//         </p>

//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
//             required
//           />
//           <button
//             type="submit"
//             className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${tab === "user" ? "from-blue-600 to-blue-500 shadow-blue-200" : "from-purple-600 to-purple-500 shadow-purple-200"
//               } hover:opacity-90 transition shadow-lg active:scale-[0.98]`}
//           >
//             Login
//           </button>
//         </form>

//         {tab === "user" && (
//           <p className="text-sm text-gray-500 text-center mt-6">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-blue-600 font-medium hover:text-blue-500 hover:underline transition"
//             >
//               Signup
//             </Link>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
 
export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await res.json();
 
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
 
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
              Login
            </h1>
          </motion.div>
        </div>
 
        {/* Login Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-xl shadow-indigo-100/20">
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
 
              </div>
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
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
 
          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
 
        {/* HR Access */}
        <p className="text-center mt-8 text-xs text-gray-400 font-medium">
          Are you an HR administrator? <Link to="/hr-login" className="text-indigo-600 hover:text-indigo-700 transition-colors">Access HR Portal</Link>
        </p>
 
        {/* Support Link */}
        {/* <p className="text-center mt-8 text-xs text-gray-400 font-medium">
          Need help? <a href="mailto:support@talentintelligence.com" className="hover:text-gray-600 transition-colors">Contact Support</a>
        </p> */}
      </motion.div>
    </div>
  );
}
 