import React from 'react'
import {Search, BellRing, Lock, Unlock, User} from "lucide-react"
import { Link } from 'react-router-dom'
import Course from './Course.jsx'
import courseList2 from './CourseData2.js'



export default function ParentsMain() {
  return (
    <div className='parents-main' style={{flexGrow: 1, minHeight: "100vh"}}>
      <div className="search-container">
        <input type="text" className='search' placeholder='type a course you look for...'  style={{flexGrow: 1}} />
        <Link><Search className='search-icon  ' style={{cursor: "pointer", color: 'gray'}} /></Link>
      </div>


      <div className="latest-courses flex py-5 gap-3 flex-wrap col-1 lg:col-3 flex-grow overflow-y-scroll max-h-[93vh]">
      {courseList2.map((course, index) => (
          <Course key={index} course={course} index={index} />
        ))}
      </div>

    </div>
  )
}
