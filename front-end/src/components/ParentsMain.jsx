import React from 'react'
import {Search} from "lucide-react"
import { Link } from 'react-router-dom'

export default function ParentsMain() {
  return (
    <div className='parents-main' style={{flexGrow: 1, minHeight: "100vh"}}>
      <div className="search-container">
        <input type="text" className='search' placeholder='type a course you look for...'  style={{flexGrow: 1}} />
        <Link><Search className='search-icon' style={{cursor: "pointer", color: 'gray'}} /></Link>
      </div>

    </div>
  )
}
