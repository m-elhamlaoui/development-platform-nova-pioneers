import "../css/signupteacher.css";
import React, { useState } from 'react';
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Signupteacher = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Parent", path: "/sign-up" },
    { label: "Teacher", path: "/Signupteacher" }
  ];

  const[showpsswd,setshowpsswd]=useState(false);
 const toggleshowPassword = () => {
  setshowpsswd((prev) => !prev);
 }

  const defaultIndex = menuItems.findIndex(item => item.path === location.pathname);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="h-[100vh] flex justify-center items-center bg-[url('./assets/space.jpg')] bg-no-repeat">
      <div className="w-4xl rounded-2xl border border-gray-400 bg-[url('./assets/astronaut.png')] bg-no-repeat bg-right">
        <div className="bg-white h-[70vh] flex flex-col items-center justify-center shadow-xl rounded-2xl border-2 border-gray-300 w-lg">
          <h1 className="text-3xl text-blue-900 font-bold text-center">CREATE YOUR ACCOUNT</h1>
          <h2 className="font-light text-sm text-center flex justify-center h-2 text-black mt-2">
            Choose a status and fill the infos below.
          </h2>

          <form className="flex flex-col items-center" action="">
            <nav className="border-gray-200 dark:bg-gray-900 h-17">
              <ul
                className="bg-blue-900 border border-gray-100 flex w-60 justify-between"
                style={{
                  padding: "6px 12px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  textTransform: "uppercase"
                }}
              >
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer font-bold rounded-xl transition duration-200 
                      ${activeIndex === index ? "bg-white text-black border border-blue-400 shadow-md" : "text-white"}
                    `}
                    style={{
                      padding: "2px 10px",
                      borderRadius: "50px",
                      fontSize: "14px"
                    }}
                  >
                    <Link
                      to={item.path}
                      className="no-underline w-full h-full block"
                      onClick={() => setActiveIndex(index)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

                  <div className="flex space-x-4">
                    <input type="text" placeholder="Last Name" className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginRight: "5px"}} />
                      <input type="text" placeholder="First Name" className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <input type="email" placeholder="Email" className="w-full block p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginTop: "5px"}} />
                        
                        <div className="relative w-full mt-2">
                            <input type={ showpsswd ? "text" : "password"}
                                       placeholder="Enter password" className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"  />
  <span onClick={toggleshowPassword} className="absolute right-4 top-6 transform -translate-y-1/2 text-gray-600 cursor-pointer">
    {showpsswd ? <FaEyeSlash/> :<FaEye/>}
  </span>
  
</div>
<div className="w-full max-w-md mx-auto">
      
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={(e) => console.log(e.target.files[0])}
      />
      <span
        htmlFor="file-upload"
        className="flex  items-center justify-center w-full  p-7 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{marginTop: "2px",
            padding:"8px",
            marginBottom:"10px",
        }}
      >
        📎 Attach a certification proof
      </span>
    </div>
                       
</form>
            
        <div>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2  w-xs px-4 rounded-2xl">Sign up</button>
          </div>

        <div class="gotosigninteacher">
          <span >
            Already have an account? <Link to="/Login" className="font-bold text-red-500 ">Sign in</Link>
          </span>
        </div>

      </div>
      </div>
      </div>
    
  );
};

export default Signupteacher;
