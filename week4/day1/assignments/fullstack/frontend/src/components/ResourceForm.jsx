import { useState } from "react";
import { createResource } from "../services/api";

export default function ResourceForm({ onCreate }) {
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createResource(form);
    setForm({ title: "", description: "" });
    onCreate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <button type="submit">Add Resource</button>
    </form>
  );
}
