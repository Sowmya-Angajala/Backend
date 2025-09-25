import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

export default function UserHome() {
  const [profile, setProfile] = useState({});
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      setProfile(res.data);
      setForm(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await updateProfile(form);
    setProfile(form);
    setEdit(false);
  };

  return (
    <div>
      <h2>User Home</h2>
      {edit ? (
        <div>
          <input name="name" value={form.name} onChange={handleChange} />
          <input name="email" value={form.email} onChange={handleChange} />
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <button onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}
