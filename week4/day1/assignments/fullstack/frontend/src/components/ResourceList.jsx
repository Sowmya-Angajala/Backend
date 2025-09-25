import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../services/api";

export default function ResourceList({ isAdmin }) {
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    const res = await getResources();
    setResources(res.data);
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = async (id) => {
    await deleteResource(id);
    fetchResources();
  };

  return (
    <div>
      <h3>Resources</h3>
      <ul>
        {resources.map(r => (
          <li key={r._id}>
            {r.title} - {r.description}
            {isAdmin && <button onClick={() => handleDelete(r._id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
