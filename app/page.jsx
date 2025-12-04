"use client";
import { useState } from "react";
import AddNotes from "./components/addnotes/page";
import ShowNotes from "./components/shownotes/page";

export default function Page() {
  const [editData, setEditData] = useState(null);
  const [mobileView, setMobileView] = useState(false); // mobile toggle

  // Edit button clicked
  const handleEdit = (note) => {
    setEditData(note);
    setMobileView(true); // Mobile me edit click → form open
  };

  const clearEdit = () => setEditData(null);

  // Update ke baad form close karne ke liye
  const closeMobileForm = () => setMobileView(false);


  // all note delete function
  const handleDeletAll = () =>{
    localStorage.clear()
    window.dispatchEvent(new Event("notesUpdated"))
  }
  return (
    <div className="w-screen min-h-screen bg-gray-800 overflow-x-hidden font-sans relative">

      {/* HEADER */}
      <div className="w-full py-3 bg-black text-white text-center text-3xl font-bold fixed top-0 left-0 z-50">
        Todo App
      </div>

      {/* MOBILE FLOAT BUTTON */}
      <button
        onClick={() => setMobileView(!mobileView)}
        className="md:hidden fixed top-20 right-5 z-50 bg-black text-white 
        w-12 h-12 rounded-full text-4xl flex justify-center items-center shadow-lg"
      >
        {mobileView ? "×" : "+"}
      </button>

      {/* ===== MOBILE VIEW ===== */}
      <div className="md:hidden pt-20 px-3">
        {mobileView ? (
          <AddNotes 
            editData={editData} 
            clearEdit={clearEdit}
            closeMobileForm={closeMobileForm}   // 🔥 UPDATE KE BAAD FORM CLOSE
          />
        ) : (
          <ShowNotes onEdit={handleEdit} />
        )}
      </div>

      {/* ===== DESKTOP + TABLET VIEW ===== */}
      <div className="hidden md:flex pt-20">

        {/* LEFT AddNotes */}
        <div className="fixed top-[64px] w-[30%] lg:w-[20%] 
        h-[calc(100vh-80px)] overflow-y-auto bg-gray-900 text-white p-4 border-r">
          <AddNotes 
            editData={editData} 
            clearEdit={clearEdit}
          />
        </div>

        {/* RIGHT ShowNotes */}
        <div className="absolute top-[64px] left-[20%] 
        w-[80%] p-4 text-white">
          <ShowNotes onEdit={handleEdit} />
        </div>
      </div>

      {/* Delete All Button */}
      <div className="fixed bottom-10 right-5 bg-red-600 text-white 
      p-3 rounded-xl shadow-lg cursor-pointer text-sm uppercase">
       <button className="cursor-pointer" onClick={handleDeletAll}> Delete All Notes</button>
      </div>

    </div>
  );
}
