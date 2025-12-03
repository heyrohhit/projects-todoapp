"use client";
import { useEffect, useState } from "react";

export default function ShowNotes() {
  const [notes, setNotes] = useState([]);

  // Load notes initially
  const loadNotes = () => {
    const stored = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(stored);
  };

  useEffect(() => {
    loadNotes(); // initial load

    // 🔥 Listen for updates
    window.addEventListener("notesUpdated", loadNotes);

    return () => {
      window.removeEventListener("notesUpdated", loadNotes);
    };
  }, []);

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(updated));
    setNotes(updated);

    // 🔥 delete par bhi event fire karna zaroori hai
    window.dispatchEvent(new Event("notesUpdated"));
  };

  return (
    <div className="w-full p-6 overflow-x-hidden md:mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-300">
        Your Notes
      </h1>

      <div className="flex gap-6 flex-wrap-reverse justify-center items-center">
        {notes.length === 0 ? (
          <h3 className="text-gray-400 capitalize flex justify-center items-center w-full h-[50vh]">
            not any notes yet....
          </h3>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="p-5 rounded-2xl shadow-lg">
              <div className="border-1 p-5 rounded-2xl shadow-lg sm:w-[75vw] max-[520px]:w-[75vw] md:w-[300px] h-[auto]">
                <h2 className="text-xl font-bold mb-2">{note.title}</h2>
                <p className="text-white-600 mb-3 whitespace-break-spaces">
                  {note.msg}
                </p>
                <p className="text-sm text-gray-400 text-right">{note.date}</p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => window.startEditNote(note)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
