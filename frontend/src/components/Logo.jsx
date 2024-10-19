import React from "react";
import logo from "../public/logo.png";

function Logo({ className = "" }) {
  return (
    <div
      className={`font-bold text-xl flex items-center justify-center w-full ${className} text-[#FFFFFF]`}
    >
      <img src={`${logo}`} alt="logo" className="w-10 h-10 inline-block mr-2" />
      <div>Viewify</div>
    </div>
  );
}

export default Logo;