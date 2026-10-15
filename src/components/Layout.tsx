import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowUpRight, Menu, X, Heart } from 'lucide-react'
import { siteSettings } from '../data/cms'

const nav = [
  ['About', '/about'], ['Departments', '/departments'], ['Learning', '/courses'],
  ['Updates', '/announcements'], ['Internships', '/internships'], ['Contact', '/contact'],
]
export function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header"><div className="container nav-wrap">
    <Link to="/" className="brand" aria-label="YSSE home"><img className="ysse-logo" src="https://i.ibb.co/N2GZ2Cvk/logo-png-01.png" alt="YSSE — Stage of Innovation" /></Link>
    <button className="mobile-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'main-nav is-open' : 'main-nav'}>{nav.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
      <Link className="button button-dark nav-cta" to="/internships" onClick={() => setOpen(false)}>Explore opportunities <ArrowUpRight size={16}/></Link>
    </nav>
  </div></header>
}
export function Footer() {
  const home = siteSettings.home || {}
  const pages = siteSettings.pages || {}
  return <footer className="footer"><div className="container"><div className="footer-top">
    <div className="footer-brand"><Link to="/" className="brand" aria-label="YSSE home"><img className="ysse-logo ysse-logo-footer" src="https://i.ibb.co/N2GZ2Cvk/logo-png-01.png" alt="YSSE — Stage of Innovation" /></Link><p>{home.footerTagline || 'Empowering young people to turn ideas into meaningful social change.'}</p></div>
    <div><h4>Explore</h4><Link to="/about">About YSSE</Link><Link to="/departments">Departments</Link><Link to="/courses">Learning</Link></div>
    <div><h4>Get involved</h4><Link to="/internships">Internships</Link><Link to="/announcements">Announcements</Link><Link to="/contact">Contact</Link></div>
    <div><h4>Official links</h4><a href={pages.officialUrl || "https://ysseglobal.org/"} target="_blank" rel="noreferrer">YSSE website ↗</a><a href={pages.facebookUrl || "https://www.facebook.com/share/1d7szMfqRa/?mibextid=wwXIfr"} target="_blank" rel="noreferrer">Facebook ↗</a><a href={pages.internshipUrl || "https://internship.ysseglobal.org/"} target="_blank" rel="noreferrer">Internship portal ↗</a></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} YSSE Portal Concept</span><span>Frontend demo · Not an official recruitment system</span><span><a href="https://www.facebook.com/rahib.irtizaabir.3/" target="_blank" rel="noreferrer" aria-label="Made by — Facebook profile">Made by</a> <Heart size={13} fill="currentColor"/></span></div></div></footer>
}
export default function Layout() { return <><Header/><main><Outlet/></main><Footer/></> }
