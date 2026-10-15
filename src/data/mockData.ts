import type { Announcement, Course, Department, Internship } from '../types'

export let departments: Department[] = [
  { id: 'admin-hr', name: 'Admin & HR', short: 'People and culture', description: 'Support people operations, team coordination, recruitment processes and a healthy organisational culture.', focus: ['People operations', 'Recruitment support', 'Team coordination'], icon: '◈' },
  { id: 'business-development', name: 'Business Development', short: 'Partnerships with purpose', description: 'Explore opportunities, build relationships and help mission-led initiatives grow sustainably.', focus: ['Partnership research', 'Opportunity mapping', 'Stakeholder relations'], icon: '↗' },
  { id: 'communication', name: 'Communication', short: 'Stories that connect', description: 'Help the organisation communicate clearly with communities, partners and young changemakers.', focus: ['Campaign communication', 'Community updates', 'Storytelling'], icon: '◎' },
  { id: 'content-writing', name: 'Content Writing', short: 'Ideas into words', description: 'Research and create thoughtful content that explains social challenges and celebrates solutions.', focus: ['Research', 'Editorial writing', 'Content planning'], icon: '✳' },
  { id: 'graphic-design', name: 'Graphic Design', short: 'Visuals with meaning', description: 'Translate ideas into accessible visual communication for digital campaigns and initiatives.', focus: ['Visual identity', 'Social media design', 'Campaign assets'], icon: '▧' },
  { id: 'marketing-pr', name: 'Marketing & PR', short: 'Reach and reputation', description: 'Help shape campaigns, audience engagement and public relations for social impact work.', focus: ['Campaign planning', 'Audience research', 'Public relations'], icon: '⌁' },
  { id: 'operations', name: 'Operations Management', short: 'Make good work happen', description: 'Coordinate activities, organise processes and help teams deliver projects reliably.', focus: ['Project coordination', 'Documentation', 'Process improvement'], icon: '⌘' },
  { id: 'video-editing', name: 'Video Editing', short: 'Impact in motion', description: 'Shape footage into engaging video stories for education, awareness and community initiatives.', focus: ['Short-form video', 'Story sequencing', 'Post-production'], icon: '▷' },
  { id: 'it', name: 'IT', short: 'Technology for impact', description: 'Support digital experiences, technical operations and tools that help social initiatives scale.', focus: ['Web development', 'Digital tools', 'Technical support'], icon: '</>' },
]

export let courses: Course[] = [
  { id: 'social-entrepreneurship', title: 'Introduction to Social Entrepreneurship', category: 'Social Impact', level: 'Beginner', duration: '4 modules', description: 'Explore how entrepreneurial thinking can respond to social and environmental challenges.', lessons: ['Welcome & learning goals', 'Core concepts', 'Practical exercise', 'Reflection & next steps'], image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85' },
  { id: 'project-planning', title: 'Project Planning & Coordination', category: 'Professional Skills', level: 'Beginner', duration: '6 modules', description: 'Build a practical foundation in planning, timelines, teamwork and project delivery.', lessons: ['Project goals', 'Plan and milestones', 'Roles and responsibilities', 'Risk and dependencies', 'Team communication', 'Review and reflection'], image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85' },
  { id: 'communication', title: 'Communication for Changemakers', category: 'Communication', level: 'Intermediate', duration: '5 modules', description: 'Learn to communicate ideas clearly across audiences, channels and contexts.', lessons: ['Audience and purpose', 'Build a clear message', 'Choose the channel', 'Feedback and listening', 'Practice and reflection'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85' },
  { id: 'digital-basics', title: 'Digital Tools for Modern Teams', category: 'Technology', level: 'Beginner', duration: '4 modules', description: 'Discover collaborative workflows and everyday digital productivity practices.', lessons: ['Digital workflow basics', 'Shared documents and files', 'Task coordination', 'Good digital habits'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85' },
]

export let announcements: Announcement[] = [
  { id: 'community-first', title: 'Building opportunities through youth-led social innovation', category: 'Stories', date: 'Illustrative feature', summary: 'A sample editorial slot for approved YSSE stories, field updates and community impact reporting.', featured: true },
  { id: 'learning-calendar', title: 'Learning sessions and capacity-building updates', category: 'Learning', date: 'Demo content', summary: 'Use this space for verified workshop dates, learning opportunities and registration details.' },
  { id: 'volunteer-opportunities', title: 'Find your place in community-focused initiatives', category: 'Opportunities', date: 'Demo content', summary: 'A placeholder for approved volunteering opportunities and calls for participation.' },
  { id: 'organisation-update', title: 'Organisation news and programme announcements', category: 'Organisation', date: 'Demo content', summary: 'Replace this sample with an official announcement before publishing.' },
]

export let internships: Internship[] = [
  { id: 'content-writing', title: 'Content Writing Intern', department: 'Content Writing', type: 'Virtual', duration: 'Programme-specific', commitment: 'Confirm in official notice', description: 'Contribute to research-led articles, campaign copy and stories about social entrepreneurship. This demo listing is illustrative; check YSSE’s official internship portal for current openings and dates.', skills: ['Writing and research', 'Editing', 'English and Bengali communication'] },
  { id: 'graphic-design', title: 'Graphic Design Intern', department: 'Graphic Design', type: 'Virtual', duration: 'Programme-specific', commitment: 'Confirm in official notice', description: 'Support visual communication through thoughtful design for campaigns, educational content and digital channels. This demo listing is illustrative.', skills: ['Layout and typography', 'Visual storytelling', 'Design software'] },
  { id: 'it-intern', title: 'IT Intern', department: 'IT', type: 'Virtual', duration: 'Programme-specific', commitment: 'Confirm in official notice', description: 'Explore practical technology work supporting digital projects, web experiences and team tools. This demo listing is illustrative.', skills: ['Problem solving', 'Web or IT fundamentals', 'Collaboration'] },
  { id: 'marketing-pr', title: 'Marketing & PR Intern', department: 'Marketing & PR', type: 'Virtual', duration: 'Programme-specific', commitment: 'Confirm in official notice', description: 'Support audience research, campaign planning and public-facing communications. This demo listing is illustrative.', skills: ['Communication', 'Research', 'Creative thinking'] },
]


export function replaceContent(next: { departments?: Department[]; courses?: Course[]; announcements?: Announcement[]; internships?: Internship[] }) {
  if (Array.isArray(next.departments)) departments = next.departments;
  if (Array.isArray(next.courses)) courses = next.courses;
  if (Array.isArray(next.announcements)) announcements = next.announcements;
  if (Array.isArray(next.internships)) internships = next.internships;
}
