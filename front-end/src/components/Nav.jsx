import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const links = {
  home: "#home",
  about: "#about",
  contact: "#contact"
};

export default function Nav() {
  const location = useLocation();
  const [active, setActive] = useState("home");

  return (
    <nav style={{
        padding: "2px 10px",
        borderRadius: "50px",
        fontSize: "14px",
        textTransform: "uppercase",

    }} className="relative w-[400px] bg-gray-900 rounded-2xl  flex justify-between items-center border border-gray-600 shadow-lg overflow-hidden" >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06')] bg-cover bg-center opacity-30 rounded-2xl"></div>
      {Object.entries(links).map(([name, path]) => (
        <a
          key={name}
          href={path}
          onClick={() => setActive(name)}
          className={`relative z-10 text-white font-bold `}
          style={active == name? {background: "white", color: "black", padding: "5px 20px", borderRadius: "20px"}:{padding: "10px 20px"}}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </a>
      ))}
      
    </nav>
  );
}
