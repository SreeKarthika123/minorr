import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateJob from "./components/CreateJob";
import Profile from "./components/Profile";
import HRLogin from "./pages/HRLogin";
import Home from "./components/Home";
import ApplyJob from "./components/ApplyJob";
import Vacancies from "./pages/Vacancies";
import HrDashboard from "./components/HrDashboard";
import TopEmployeesHR from "./components/TopEmployeesHR";
import Recruitment from "./pages/Recruitment";
import TopEmployees from "./components/TopEmployees";
import VacancyCandidates from "./components/VacancyCandidates";
import TopCards from "./components/TopCards"
import UserProfileView from "./components/UserProfileView";
import Applications from "./components/Applications"
import Analytics from "./components/Analytics";
import HRLayout from "./layouts/HRLayout";
import RoleSelection from "./components/RoleSelection";
function App() {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(
    storedUser && storedUser !== "undefined" && storedUser !== "null"
      ? JSON.parse(storedUser)
      : null
  );

  const isHr = user?.role === "hr";

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RoleSelection />}
        />
       
<Route
  path="/hr-login"
  element={user && user.role === "hr" ? <Navigate to="/home" /> : <HRLogin setUser={setUser} />}
/>

{/* Employee Login */}
<Route
  path="/login"
  element={user && user.role !== "hr" ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
/>
        {/* <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} /> */}
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup setUser={setUser} />} />
         {/* <Route path="/hr-login" element={<HRLogin setUser={setUser} />} />  */}
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/users/:userId" element={<UserProfileView />} />

        {/* User Routes (Generic Dashboard/Profile) */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/recruitment" element={user ? <Recruitment /> : <Navigate to="/login" />} />
        <Route path="/applications" element={user ? <Applications /> : <Navigate to="/login" />} />
        <Route path="/top-emp" element={user ? <TopEmployees /> : <Navigate to="/login" />} />

        {/* HR Panel Routes (Wrapped in HRLayout) */}
      <Route element={isHr ? <HRLayout setUser={setUser} /> : <Navigate to="/login" />}>
  <Route path="/home" element={<Home />} />
          <Route path="/hr-dashboard" element={<Home />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route
            path="/edit-job/:id"
            element={
              user?.role === "hr"
                ? <CreateJob />
                : <Navigate to="/hr-login" />
            }
          />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/topcards" element={<TopCards />} />
          <Route path="/top-employees" element={<TopEmployeesHR />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/hr/vacancies/:vacancyId/candidates" element={<VacancyCandidates />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
