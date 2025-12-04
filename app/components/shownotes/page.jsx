"use client";
import { useState, useEffect } from "react";


export default function ShowNotes({ onEdit }) {
  const [notes, setNotes] = useState([]);

  const loadNotes = () => {
    const stored = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(stored);
  };

  useEffect(() => {
    loadNotes();

    window.addEventListener("notesUpdated", loadNotes);
    return () => window.removeEventListener("notesUpdated", loadNotes);
  }, []);

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);

    localStorage.setItem("notes", JSON.stringify(updated));
    setNotes(updated);



    window.dispatchEvent(new Event("notesUpdated"));
  };

  const formatDate = (d) => new Date(d).toLocaleString();


  return (
    <div className="w-full overflow-x-hidden p-4 min-h-[60vh md:ml-20 lg:ml-0">

      <h2 className="text-3xl font-bold text-white mb-5">Your Notes</h2>

      {/* Notes Grid */}
      <div className={`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 p-2 place-items-center`}>
        {notes.slice().reverse().map((note) => (
          <div
            key={note.id}
            className={`w-[220px] mb-4 break-inside-avoid h-fit bg-gradient-to-br from-[#a256f2] to-[#0459ed] text-white p-5 rounded-2xl shadow-lg backdrop-blur-lg transition-transform hover:scale-[1.02] hover:shadow-2xl overflow-x-hidden`}
          >
            {/* Title */}
            <h3 className="text-xl font-bold truncate">{note.title}</h3>

            {/* Message */}
            <p className="whitespace-pre-line mt-2 text-sm opacity-90">
              {note.msg}
            </p>

            {/* Date */}
            {note.date && (
              <div className="mt-3 text-xs bg-black/30 inline-block px-3 py-1 rounded-full">
                <p className="text-xs p-1">📅  {formatDate(note.date)}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onEdit(note)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-center text-gray-300 text-lg mt-10">
          No notes found. Create a new one!
        </p>
      )}
    </div>
  );
}
