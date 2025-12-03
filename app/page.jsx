"use client"

import Addnotes from "./components/addnotes/page"
import Shownotes from "./components/shownotes/page"

const page = () => {
  
  const deletenotes =()=>{
    console.log("working")
    localStorage.clear()
    window.dispatchEvent(new Event("notesUpdated"));
  }
  return (
    <div className="w-screen flex flex-wrap relative h-fit overflow-x-hidden">
    <header className="p-2 w-full items-center sm:sticky md:fixed top-0 z-10 bg-black">
      <h1 className="flex justify-center items-center text-3xl ">Todo App</h1>
    </header>
   <div className="flex w-screen flex-wrap ">
     <div className="sm:w-full md:w-[30%] h-fit sm:sticky md:fixed md:z-[9] top-[50px] bg-black">
      <Addnotes/>
    </div>
    <div className="md:w-[70%] p-4 sm:w-full md:sticky md:top-[10%] md:left-[30%]">
      <Shownotes/>
    </div>
    <div className="fixed bottom-5 right-5">
      <button className="bg-orange-500 p-2 rounded-full"
      onClick={deletenotes}>
        Delete All Notes
      </button>
    </div>
   </div>
    </div>
  )
}

export default page