import type { ReactNode } from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export function Eyebrow({children}: {children: ReactNode}) { return <div className="eyebrow"><span className="eyebrow-dot"/>{children}</div> }
export function SectionHeading({eyebrow, title, text, link, to}: {eyebrow: string; title: string; text?: string; link?: string; to?: string}) {
  return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>{link && to && <Link className="text-link" to={to}>{link} <ArrowUpRight size={16}/></Link>}</div>
}
export function ButtonLink({to, children, variant='dark'}: {to: string; children: ReactNode; variant?: 'dark'|'light'|'outline'}) { return <Link to={to} className={`button button-${variant}`}>{children}<ArrowRight size={16}/></Link> }
export function DemoNotice({children='This is a frontend demonstration. No real application or message is sent.'}: {children?: ReactNode}) { return <div className="demo-notice"><span>DEMO</span>{children}</div> }
export function EmptyState({title, text}: {title: string; text: string}) { return <div className="empty-state"><span>↗</span><h3>{title}</h3><p>{text}</p></div> }
