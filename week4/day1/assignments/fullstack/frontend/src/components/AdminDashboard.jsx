import { useEffect, useState } from "react";
import { getUsers } from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>All Users</h3>
      <ul>
        {users.map(u => <li key={u._id}>{u.name} ({u.role})</li>)}
      </ul>
    </div>
  );
}
