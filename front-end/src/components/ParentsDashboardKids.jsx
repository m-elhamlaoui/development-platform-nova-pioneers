import React from 'react'
import Menu from "./ui/Menu"
import LessonsMain from './KidsMain'
export default function ParentsDashboardLessons() {
  return (
    <div className='dashboard'>
            <Menu />
            <LessonsMain />
    </div>
  )
}
