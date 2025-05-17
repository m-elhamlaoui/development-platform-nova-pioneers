import React from 'react'
import {Search, BellRing, Lock, Unlock, User} from "lucide-react"
import { Link } from 'react-router-dom'
import container from "../assets/hell-cont.png"
import Course from './Course.jsx'
import courseList from './CourseData.js'



export default function ParentsMain() {
  return (
    <div className='parents-main' style={{flexGrow: 1, minHeight: "100vh"}}>
      {/* <div className="search-container">
        <input type="text" className='search' placeholder='type a course you look for...'  style={{flexGrow: 1}} />
        <Link><Search className='search-icon  ' style={{cursor: "pointer", color: 'gray'}} /></Link>
      </div> */}
      <div
        className="dashboard-hello relative h-[180px] mx-auto my-4 rounded-2xl text-white flex flex-col justify-center px-6 sm:px-10 shadow-md overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 61, 145, 0.9), rgba(11, 61, 145, 0.5)), url(${container})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <p className="text-sm uppercase tracking-wider font-medium text-white/80 mb-1">
          Online Courses
        </p>
        <p className="text-xl sm:text-2xl font-semibold leading-snug">
          Discover more <br />
          About our beautiful universe
        </p>
      </div>
      <div className="alerts-admin flex justify-center items-center">
        <div className="admin-alert flex justify-center items-center gap-3 w-[fit-content] shadow px-5 py-2 rounded-xl">
          <div className="bell-container flex justify-center items-center rounded-[50px] p-4 w-[fit-content]" style={{background: "rgba(112, 45, 255, 0.2)"}}>
            <BellRing className='text-[#0B3D91] cursor-pointer'></BellRing>
          </div>
          <div className="alert-info">
            <div className="a-title font-semibold">Administrator</div>
            <div className="a-subject font-medium">Object: a response to your report</div>
          </div>
        </div>
      </div>
      <div className="latest-courses flex py-5 gap-3 flex-wrap col-1 lg:col-3 flex-grow">
      {courseList.map((course, index) => (
          <Course key={index} course={course} index={index} />
        ))}
      </div>
      <div className="kids-sec-dashboard flex items-center justify-center bg-white my-3 shadow-xl rounded p-3 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <table className='text-m' style={{flexGrow: 1}}>
          <tr className='font-bold'>
            <td>Kid's Name and Date</td>
            <td>Badge</td>
            <td>Accumulated XP</td>
            <td>Restrictions</td>
          </tr>
  
            <tr className=''>
              <td className='flex items-center justify-center gap-2 '>
              <div className="p-1 bg-[#0b3d91] rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="infos-kid-container">
              <p className="font-semibold text-s">Zakaria OUMGHAR</p>
              <p className="text-xs text-left">02/03/2024</p>
              </div>
     
              </td>
              <td><span className='text-xs px-3 py-1 bg-black text-white rounded-xl'>Astronaut</span></td>
              <td className='text-s font-bold text-[#69ebb7]'>32748 XP</td>
              <td className='flex justify-center '><Lock className='text-[#69ebb7]'></Lock></td>
            </tr>


            <tr className=''>
              <td className='flex items-center justify-center gap-2'>
              <div className="p-1 bg-[#0b3d91] rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="infos-kid-container">
              <p className="font-semibold text-s">Zakaria OUMGHAR</p>
              <p className="text-xs text-left">02/03/2024</p>
              </div>
     
              </td>
              <td><span className='text-xs px-3 py-1 bg-green-400 text-white rounded-xl'>Explorer</span></td>
              <td className='text-s font-bold text-[#69ebb7]'>32748 XP</td>
              <td className='flex justify-center '><Unlock className='text-red-600 '></Unlock></td>
            </tr>
        </table>
      </div>
    </div>
  )
}
