

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
 
export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("user"); // "user" or "hr"
 
  // Common states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setError("");
 
    if (tab === "hr") {
      // HR login
      if (email === HR_CREDENTIALS.email && password === HR_CREDENTIALS.password) {
        localStorage.setItem("user", JSON.stringify(HR_CREDENTIALS));
        setUser(HR_CREDENTIALS);
        navigate("/home"); // HR dashboard
      } else {
        setError("Invalid HR email or password");
      }
    } else {
      // Regular user login
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
          navigate("/dashboard"); // user dashboard
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Try again.");
      }
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
 
        {/* Tab switch */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${tab === "user"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            onClick={() => setTab("user")}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${tab === "hr"
                ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            onClick={() => setTab("hr")}
          >
            HR Login
          </button>
        </div>
 
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
          {tab === "user" ? "Welcome Back 👋" : "HR Login"}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {tab === "user"
            ? "Login to access your dashboard"
            : "Enter your HR credentials"}
        </p>
 
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
 
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            required
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${tab === "user" ? "from-blue-600 to-blue-500 shadow-blue-200" : "from-purple-600 to-purple-500 shadow-purple-200"
              } hover:opacity-90 transition shadow-lg active:scale-[0.98]`}
          >
            Login
          </button>
        </form>
 
        {tab === "user" && (
          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:text-blue-500 hover:underline transition"
            >
              Signup
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function HRLogin({ setUser }) {
//   const navigate = useNavigate();
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

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (email === HR_CREDENTIALS.email && password === HR_CREDENTIALS.password) {
//       // Save HR info in localStorage (no token)
//       localStorage.setItem("user", JSON.stringify(HR_CREDENTIALS));
//        setUser(HR_CREDENTIALS); //
//       navigate("/home"); // go to HR dashboard
//     } else {
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-96 space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center mb-4">HR Login</h2>

//         {error && <p className="text-red-500">{error}</p>}

//         <div>
//           <label className="block mb-1 font-semibold">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             placeholder="hr@example.com"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-semibold">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             placeholder="hr123"
//             required
//           />
//         </div>

//         <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
