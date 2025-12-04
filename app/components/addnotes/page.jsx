"use client";
import { useState, useEffect } from "react";

export default function AddNotes({ editData, clearEdit, closeMobileForm }) {
  
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(true);

  const getFormattedDateTime = () => {
    return new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    title: "",
    msg: "",
    date: getFormattedDateTime(),
  });

  // EDIT MODE (Load existing note)
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  // Input change handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.msg) {
      setOpen(false);
      setAlert("Please fill all fields");
      setTimeout(() => setAlert(""), 1500);
      return;
    }

    // Set fresh date/time for NEW note OR updated note
    const updatedFormData = { ...formData, date: getFormattedDateTime() };

    const res = await fetch("/api/addNotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    });

    const data = await res.json();

    if (data.success) {
      const newNote = data.note;
      const oldNotes = JSON.parse(localStorage.getItem("notes")) || [];

      closeMobileForm && closeMobileForm(); // 👈 MOBILE FORM CLOSE

      let updatedNotes = [];

      if (editData) {
        // EDIT MODE
        updatedNotes = oldNotes.map((n) =>
          n.id === newNote.id ? newNote : n
        );

        clearEdit(); // reset edit mode
        closeMobileForm && closeMobileForm(); // 👈 MOBILE FORM CLOSE
      } else {
        // ADD MODE
        updatedNotes = [...oldNotes, newNote];
      }

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event("notesUpdated"));

      // Reset form
      setFormData({
        id: crypto.randomUUID(),
        title: "",
        msg: "",
        date: getFormattedDateTime(),
      });

      setAlert(editData ? "Note Updated!" : "Note Added!");
      setOpen(true);
      setTimeout(() => setAlert(""), 1500);
    }
  };

  return (
    <div className="w-full h-full p-6 rounded-xl shadow-lg bg-gray-900 text-white">

      <h2 className="text-2xl font-bold text-center mb-4">
        {editData ? "Edit Note" : "Add Note"}
      </h2>

      {alert && (
        <div
          className={`${open ? "bg-green-600" : "bg-red-600"} 
          w-full text-center p-2 mb-3 rounded`}
        >
          {alert}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          id="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 rounded text-white focus:border border-b-2 border-b-gray-500"
        />

        <textarea
          id="msg"
          placeholder="Enter Description"
          value={formData.msg}
          onChange={handleChange}
          className="p-2 rounded h-32 active:border whitespace-break-spaces resize-none text-white border-b-2  border-b-gray-500"
        />

       <div className="wfull flex justify-around text-center items-center flex-wrap gap-5 ">
        <p className="md:w-[200px] text-sm md:text-right text-gray-600 sm:text-left">
          {getFormattedDateTime()}
        </p>
         <button
          type="submit"
          className="w-[200px] bg-orange-500 text-white py-2 rounded-xl font-bold"
        >
          {editData ? "Update" : "Add"}
        </button>
       </div>

      </form>

    </div>
  );
}
