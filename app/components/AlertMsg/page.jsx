"use client";
import { useEffect } from "react";

const AlertMsg = ({ type = "success", msg, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2 seconds auto hide

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-full p-3 rounded text-white text-center font-semibold 
      ${type === "error" ? "bg-red-600" : "bg-green-600"}
      `}
    >
      {msg}
    </div>
  );
};

export default AlertMsg;
