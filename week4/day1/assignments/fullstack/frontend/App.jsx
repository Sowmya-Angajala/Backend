import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserHome from "./components/UserHome";
import ResourceList from "./components/ResourceList";
import ResourceForm from "./components/ResourceForm";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const handleLogin = (user) => { setUser(user); localStorage.setItem("user", JSON.stringify(user)); };
  const handleRegister = (user) => { setUser(user); localStorage.setItem("user", JSON.stringify(user)); };
  const handleLogout = () => { setUser(null); localStorage.clear(); };

  if(!user) return (
    <div>
      <Login onLogin={handleLogin} />
      <Register onRegister={handleRegister} />
    </div>
  );

  return (
    <div>
      <h1>Welcome {user.name} ({user.role})</h1>
      <button onClick={handleLogout}>Logout</button>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "user" && <UserHome />}
      <ResourceForm onCreate={() => {}} />
      <ResourceList isAdmin={user.role === "admin"} />
    </div>
  );
}
