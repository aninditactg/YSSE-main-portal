import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { About, Departments, DepartmentDetail, Courses, CourseDetail, Announcements, AnnouncementDetail, Internships, InternshipDetail, Apply, CandidateDashboard, RecruitmentDashboard, Contact, NotFound } from './pages/Pages'
import AdminApp from './admin/AdminApp'
import { refreshCMS } from './data/cms'

export default function App() {
  const [, setCmsRevision] = useState(0)
  useEffect(() => {
    const update = () => setCmsRevision(value => value + 1)
    window.addEventListener('ysse:cms-updated', update)
    void refreshCMS()
    // Recheck periodically so changes saved in a second admin/browser tab appear automatically.
    const interval = window.setInterval(() => { void refreshCMS() }, 30000)
    return () => { window.removeEventListener('ysse:cms-updated', update); window.clearInterval(interval) }
  }, [])
  return <Routes>
    <Route path="/admin/*" element={<AdminApp/>}/>
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/departments" element={<Departments/>}/>
      <Route path="/departments/:id" element={<DepartmentDetail/>}/>
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/courses/:id" element={<CourseDetail/>}/>
      <Route path="/announcements" element={<Announcements/>}/>
      <Route path="/announcements/:id" element={<AnnouncementDetail/>}/>
      <Route path="/internships" element={<Internships/>}/>
      <Route path="/internships/:id" element={<InternshipDetail/>}/>
      <Route path="/apply" element={<Apply/>}/>
      <Route path="/apply/:id" element={<Apply/>}/>
      <Route path="/candidate-dashboard" element={<CandidateDashboard/>}/>
      <Route path="/recruitment-dashboard" element={<RecruitmentDashboard/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  </Routes>
}
