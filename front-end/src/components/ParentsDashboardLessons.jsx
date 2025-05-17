import React from 'react'
import Menu from "../components/ui/Menu"
import LessonsMain from './LessonsMain'
export default function ParentsDashboardLessons() {
  return (
    <div className='dashboard'>
            <Menu />
            <LessonsMain />
    </div>
  )
}
