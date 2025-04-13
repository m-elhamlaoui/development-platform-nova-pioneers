import "../css/Login.css";
import React, { useState } from 'react';
import { FaEye,FaEyeSlash } from "react-icons/fa";
import {Link} from "react-router-dom";


const Login = () => {

  const[showpsswd,setshowpsswd]=useState(false);
 const toggleshowPassword = () => {
  setshowpsswd((prev) => !prev);
 }
  return (
    <div className=" h-[100vh] flex justify-center items-center bg-[url('./assets/space.jpg')] bg-no-repeat ">

    <div className="w-4xl rounded-2xl border border-gray-400 bg-[url('./assets/astronaut.png')] bg-no-repeat bg-right">

      <div className="bg-white h-[70vh]  flex flex-col items-center justify-center shadow-xl  rounded-2xl border-2 border-gray-300 w-lg">
        <h1 className='text-4xl text-blue-900 honesignin font-bold text-center '>WELCOME BACK</h1>
        <h2 className="text-sm text-black htwosignin font-light text-center ">Welcome Back! Please enter your details</h2>
            

<form class=" flex flex-col items-center " acion="">
    <div className="w-full relative">
  <div >
    <label for="email" class="block mb-2 text-sm font-medium signinl text-gray-900 dark:text-white">Email</label>
    <input type="email" id="email" className=" border  w-full signin rounded-lg py-2 px-4 bg-white" placeholder="Enter your email" required />
  </div>
  <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 signinl dark:text-white">Password</label>
     <div className="relative w-full mt-2">
                                <input type={ showpsswd ? "text" : "password"}
                                           placeholder="Enter password" className="w-full p-3 pr-10 signin border rounded-lg focus:outline-none "  />
      <span onClick={toggleshowPassword} className="absolute right-4 top-6 transform -translate-y-1/2 text-gray-600 cursor-pointer">
        {showpsswd ? <FaEye/> :<FaEyeSlash/>}
      </span>
    </div>
    
  </div>
  <div class="flex justify-center items-center ">
        <div class="  w-1/2 ">
            <input id="remember_me" name="remember" type="checkbox" value="1" class=" signin transition duration-150 ease-in-out" />
              <span for="remember_me" class=" blockrem" >Remember me</span>
   </div>
   
    <div class=" flex whitespace-nowrap  h-8 w-1/2  ">
        <Link  to="#" class="forgotpswd">
          Forgot your password 
                        </Link>
                    </div>
                
  </div>
  </div>
</form>
            
        <div>
          <button className="bg-red-500 btnsignin text-white font-bold py-2  w-xs px-4 rounded-2xl">Log in</button>
          </div>

        <div class="gotosignup">
          <span >
            Don't have an account? <Link to="/sign-up" className="font-bold text-red-500 ">Sign up</Link>
          </span>
        </div>

      
      </div>
      </div>
      </div>
    
  );
};

export default Login;
