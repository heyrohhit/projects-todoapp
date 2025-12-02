"use client";
import { useState, useEffect } from "react";
import AlertMsg from "../AlertMsg/page";

const Page = () => {
  const [formShow, setFormShow] = useState(false);

  const [noteData, setNoteData] = useState({
    id: null,
    title: "",
    msg: "",
    date: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // 🔥 Alert message states
  const [alert, setAlert] = useState(null);

  // 🔥 Loading message (Note Adding…)
  const [loadingMsg, setLoadingMsg] = useState("");

  const toggleForm = () => setFormShow(!formShow);

  const handelForm = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Show loading message
    setLoadingMsg(isEdit ? "Updating note..." : "Adding note...");

    let finalNote = {
      ...noteData,
      date: new Date().toLocaleString(),
      id: noteData.id || Date.now(),
    };

    const response = await fetch("/api/addNotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalNote),
    });

    const data = await response.json();

    if (data.success) {
      const oldNotes = JSON.parse(localStorage.getItem("notes") || "[]");

      let updatedNotes = [];

      if (isEdit) {
        updatedNotes = oldNotes.map((n) =>
          n.id === finalNote.id ? finalNote : n
        );
      } else {
        updatedNotes = [...oldNotes, finalNote];
      }

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event("notesUpdated"));

      // Hide loading
      setLoadingMsg("");

      // Show success alert
      setAlert({
        type: "success",
        msg: isEdit ? "Note Updated Successfully!" : "Note Added Successfully!",
      });

      // Reset form
      setNoteData({
        id: null,
        title: "",
        msg: "",
        date: "",
      });

      setIsEdit(false);
      setFormShow(false);
    } else {
      setLoadingMsg("");

      setAlert({
        type: "error",
        msg: data.error,
      });
    }
  };

  const startEdit = (note) => {
    setNoteData(note);
    window.dispatchEvent(new Event("notesUpdated"));
    setIsEdit(true);
    setFormShow(true);
  };

  useEffect(() => {
    window.startEditNote = startEdit;
    window.dispatchEvent(new Event("notesUpdated"));
  }, []);

  return (
    <main className={`h-fit sticky top-[60px] ${formShow ? "h-screen" : "sm:h-auto md:h-screen"} bg-[rgba(0,0,0,0.5)]`}>

      {/* 🔥 ALERT MESSAGE (Show Below Add Button) */}
      <div className="w-full max-w-xl mx-auto mt-2">
        {alert && (
          <AlertMsg
            type={alert.type}
            msg={alert.msg}
            onClose={() => setAlert(null)}
          />
        )}
      </div>

      {/* 🔥 LOADING MESSAGE */}
      {loadingMsg && (
        <p className="text-center text-white mt-2">{loadingMsg}</p>
      )}

      <div
        className={`
         text-white p-6 rounded-lg w-full max-w-xl
          transition-all duration-300
          ${formShow ? "fixed" : "hidden md:block"}
        `}
      >
        <h1 className="text-2xl text-white font-bold text-center mb-4">
          {isEdit ? "Edit Note" : "Add New Note"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={submitHandler} method="POST">
          <input
            type="text"
            placeholder="Enter title"
            name="title"
            value={noteData.title}
            onChange={handelForm}
            className="rounded p-2 focus:bg-blue-200 focus:text-black md:w-[80%]"
          />

          <textarea
            placeholder="Enter description"
            name="msg"
            value={noteData.msg}
            onChange={handelForm}
            className="md:w-[80%] rounded p-2 h-40 resize-none focus:bg-blue-200 focus:text-black"
          ></textarea>

          <button
            type="submit"
            className="w-[100px] bg-orange-500 p-3 rounded-xl hover:bg-orange-600 text-white"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </form>
      </div>

      <button
        onClick={toggleForm}
        className="md:hidden fixed top-15 right-5 bg-black text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl"
      >
        {formShow ? "X" : "+"}
      </button>
    </main>
  );
};

export default Page;
