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
    <div className="w-full md:ml-20 overflow-x-hidden p-4 min-h-[60vh] flex justify-center flex-col items-center md:items-start">

      <h2 className="text-3xl font-bold text-white mb-5 font-[time-new-roman] font-semibold">Your Notes</h2>

      {/* Masonry Layout (Pinterest Style) */}
      <div className="w-full 
      max-[990px]:w-[65vw] md:w-[63vw] columns-1 sm:columns-2  md:columns-3 max-[990px]:columns-1 lg:columns-4">
        {notes.slice().reverse().map((note) => (
          <div
            key={note.id}
            className="
              break-inside-avoid-column 
              mb-5 
              bg-gradient-to-br from-[#a256f2] to-[#0459ed] 
              text-white 
              p-5 
              rounded-2xl 
              shadow-lg 
              backdrop-blur-lg 
              transition-transform 
              hover:scale-[1.02] 
              hover:shadow-2xl 
              h-fit"
          >
            {/* Title */}
            <h3 className="text-xl break-all font-medium capitalize font-[cursive]">{note.title}</h3>

            {/* Message */}
            <p className="whitespace-pre-line mt-2 text-sm opacity-90 break-all capitalize text-gray-300">
              {note.msg}
            </p>

            {/* Date */}
            {note.date && (
              <div className="mt-3 text-xs bg-black/30 inline-block px-3 py-1 rounded-full">
                <p className="text-xs">📅 {formatDate(note.date)}</p>
              </div>
            )}

            {/* Buttons */}
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
