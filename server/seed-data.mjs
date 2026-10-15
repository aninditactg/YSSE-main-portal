export const contentSeed = {
  departments: [
    { id:'admin-hr', name:'Admin & HR', short:'People and culture', description:'Support people operations, team coordination, recruitment processes and a healthy organisational culture.', focus:['People operations','Recruitment support','Team coordination'], icon:'◈', image:'' },
    { id:'business-development', name:'Business Development', short:'Partnerships with purpose', description:'Explore opportunities, build relationships and help mission-led initiatives grow sustainably.', focus:['Partnership research','Opportunity mapping','Stakeholder relations'], icon:'↗', image:'' },
    { id:'communication', name:'Communication', short:'Stories that connect', description:'Help the organisation communicate clearly with communities, partners and young changemakers.', focus:['Campaign communication','Community updates','Storytelling'], icon:'◎', image:'' },
    { id:'content-writing', name:'Content Writing', short:'Ideas into words', description:'Research and create thoughtful content that explains social challenges and celebrates solutions.', focus:['Research','Editorial writing','Content planning'], icon:'✳', image:'' },
    { id:'graphic-design', name:'Graphic Design', short:'Visuals with meaning', description:'Translate ideas into accessible visual communication for digital campaigns and initiatives.', focus:['Visual identity','Social media design','Campaign assets'], icon:'▧', image:'' },
    { id:'marketing-pr', name:'Marketing & PR', short:'Reach and reputation', description:'Help shape campaigns, audience engagement and public relations for social impact work.', focus:['Campaign planning','Audience research','Public relations'], icon:'⌁', image:'' },
    { id:'operations', name:'Operations Management', short:'Make good work happen', description:'Coordinate activities, organise processes and help teams deliver projects reliably.', focus:['Project coordination','Documentation','Process improvement'], icon:'⌘', image:'' },
    { id:'video-editing', name:'Video Editing', short:'Impact in motion', description:'Shape footage into engaging video stories for education, awareness and community initiatives.', focus:['Short-form video','Story sequencing','Post-production'], icon:'▷', image:'' },
    { id:'it', name:'IT', short:'Technology for impact', description:'Support digital experiences, technical operations and tools that help social initiatives scale.', focus:['Web development','Digital tools','Technical support'], icon:'</>', image:'' }
  ],
  courses: [
    { id:'social-entrepreneurship', title:'Introduction to Social Entrepreneurship', category:'Social Impact', level:'Beginner', duration:'4 modules', description:'Explore how entrepreneurial thinking can respond to social and environmental challenges.', lessons:['Welcome & learning goals','Core concepts','Practical exercise','Reflection & next steps'], image:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85' },
    { id:'project-planning', title:'Project Planning & Coordination', category:'Professional Skills', level:'Beginner', duration:'6 modules', description:'Build a practical foundation in planning, timelines, teamwork and project delivery.', lessons:['Project goals','Plan and milestones','Roles and responsibilities','Risk and dependencies','Team communication','Review and reflection'], image:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85' },
    { id:'communication', title:'Communication for Changemakers', category:'Communication', level:'Intermediate', duration:'5 modules', description:'Learn to communicate ideas clearly across audiences, channels and contexts.', lessons:['Audience and purpose','Build a clear message','Choose the channel','Feedback and listening','Practice and reflection'], image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85' },
    { id:'digital-basics', title:'Digital Tools for Modern Teams', category:'Technology', level:'Beginner', duration:'4 modules', description:'Discover collaborative workflows and everyday digital productivity practices.', lessons:['Digital workflow basics','Shared documents and files','Task coordination','Good digital habits'], image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85' }
  ],
  announcements: [
    { id:'community-first', title:'Building opportunities through youth-led social innovation', category:'Stories', date:'Update date to publish', summary:'An editable slot for approved YSSE stories, field updates and community impact reporting.', content:'Replace this draft with a verified announcement before publishing.', featured:true, image:'' },
    { id:'learning-calendar', title:'Learning sessions and capacity-building updates', category:'Learning', date:'Update date to publish', summary:'Use this space for verified workshop dates, learning opportunities and registration details.', content:'Replace this draft with verified event details.', image:'' },
    { id:'volunteer-opportunities', title:'Find your place in community-focused initiatives', category:'Opportunities', date:'Update date to publish', summary:'A slot for approved volunteering opportunities and calls for participation.', content:'Replace this draft with verified opportunity details.', image:'' },
    { id:'organisation-update', title:'Organisation news and programme announcements', category:'Organisation', date:'Update date to publish', summary:'Replace this draft with an official announcement before publishing.', content:'Replace this draft with verified organisation news.', image:'' }
  ],
  internships: [
    { id:'content-writing', title:'Content Writing Intern', department:'Content Writing', type:'Virtual', duration:'Programme-specific', commitment:'Confirm in official notice', description:'Support research-led articles, campaign copy and stories about social entrepreneurship. Illustrative role; verify open positions and dates with YSSE.', skills:['Writing and research','Editing','English and Bengali communication'], image:'', status:'Draft' },
    { id:'graphic-design', title:'Graphic Design Intern', department:'Graphic Design', type:'Virtual', duration:'Programme-specific', commitment:'Confirm in official notice', description:'Support visual communication through design for campaigns, educational content and digital channels. Illustrative role.', skills:['Layout and typography','Visual storytelling','Design software'], image:'', status:'Draft' },
    { id:'it-intern', title:'IT Intern', department:'IT', type:'Virtual', duration:'Programme-specific', commitment:'Confirm in official notice', description:'Explore practical technology work supporting digital projects, web experiences and team tools. Illustrative role.', skills:['Problem solving','Web or IT fundamentals','Collaboration'], image:'', status:'Draft' },
    { id:'marketing-pr', title:'Marketing & PR Intern', department:'Marketing & PR', type:'Virtual', duration:'Programme-specific', commitment:'Confirm in official notice', description:'Support audience research, campaign planning and public-facing communications. Illustrative role.', skills:['Communication','Research','Creative thinking'], image:'', status:'Draft' }
  ]
};

// Editable detail-page copy is added to each seeded record; administrators can replace every field.
for (const department of contentSeed.departments) Object.assign(department, {
  detailEyebrow: 'What this team focuses on',
  detailHeading: 'Turn your strengths into useful work.',
  detailDescription: 'Department responsibilities and projects depend on current organisational priorities. Review these focus areas as a starting point and replace them with approved details.',
  teamEyebrow: 'Team structure · Illustrative',
  teamTitle: 'People behind the work.',
  teamDescription: 'These are role placeholders to demonstrate the requested department hierarchy. Replace them with names, approved photos and biographies supplied by YSSE.',
  teamHeadTitle: 'Department Head',
  teamHeadDescription: 'Sets priorities and coordinates with the wider organisation.',
  teamHeadNote: 'Official profile to be supplied',
  teamCoordinatorTitle: 'Team Lead / Coordinator',
  teamCoordinatorDescription: 'Organises tasks, supports team members and tracks progress.',
  teamCoordinatorNote: 'Official profile to be supplied',
  teamMembersTitle: 'Members & Interns',
  teamMembersDescription: 'Contribute to projects, research, communications and team activities.',
  teamMembersNote: 'Official profiles to be supplied',
});
for (const course of contentSeed.courses) Object.assign(course, {
  detailHeading: 'Learn one step at a time.',
  detailDescription: 'This sample course detail demonstrates how lesson modules and progress can work in a future learning portal.',
  lessonEyebrow: 'Learning path · Demo',
  overviewTitle: 'Course overview',
  moduleDescription: 'Video / reading placeholder · 10–15 min',
});

export const settingsSeed = {
  home: {
    heroEyebrow:'Youth-led. Purpose-driven. Future-focused.', heroTitleLine1:'Big ideas.', heroTitleAccent:'Meaningful', heroTitleLine3:'change.',
    heroDescription:'A place for young changemakers to learn, build ideas and help shape a more inclusive future through social entrepreneurship.',
    heroImage:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=90',
    featureImage:'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85',
    aboutHeading:'Turning youth potential into purposeful action.',
    aboutBody:'YSSE — Youth School for Social Entrepreneurs — is a youth-led nonprofit organisation working to promote social entrepreneurship and empower young people and women. Its work centres on helping communities turn challenges into opportunities.',
    introEyebrow:'A little about us', introAsideText:'We believe progress grows when people have the confidence and tools to create it.', footerTagline:'Empowering young people to turn ideas into meaningful social change.',
    impactEyebrow:'Why we exist', impactTitle:'Change needs more than good intentions.', impactDescription:'It needs people with skills, ideas, support and the courage to begin.',
    impact1Title:'Social entrepreneurship', impact1Text:'Support ideas that respond to real community challenges.', impact2Title:'Youth empowerment', impact2Text:'Create space for young people to learn, lead and collaborate.', impact3Title:'Community-led change', impact3Text:'Connect people and initiatives around a more inclusive future.',
    departmentsEyebrow:'Find your contribution', departmentsTitle:'Different skills. Shared purpose.', departmentsDescription:'Explore the departments featured in YSSE’s virtual internship programme.',
    featureEyebrow:'Make room for your next chapter', featureTitleLine1:'Bring your curiosity.', featureTitleLine2:'Leave with capability.', featureDescription:'Explore a virtual internship pathway and find the department that fits your skills and interests.', featureSmallPrint:'Listings on this concept site are illustrative. Always verify current openings on YSSE’s official portal.',
    learningEyebrow:'Keep learning', learningTitle:'Skills for the work that matters.', learningDescription:'A sample learning catalogue for practical skills, collaboration and social impact.',
    newsEyebrow:'From the community', newsTitle:'Stories, updates and opportunities.', newsDescription:'A home for verified organisation news, events and learning announcements.',
    socialEyebrow:'Stay connected', socialTitleLine1:'Good work grows', socialTitleLine2:'when we share it.', socialDescription:'Visit YSSE’s official channels for verified stories, activities and announcements.',
  },
  about: {
    heroEyebrow:'Our purpose', heroTitle:'Young people can change the world they inherit.',
    heroDescription:'Get to know the mission behind Youth School for Social Entrepreneurs and the values that guide its work.',
    sectionEyebrow:'About YSSE', heading:'Empowering youth with compassion and purpose.',
    body:'YSSE describes itself as a youth-led nonprofit organisation working for social development since 2015. Its work focuses on promoting social entrepreneurship, addressing youth unemployment, and empowering young people and women.',
    bodySecondary:'The aim is to help young people develop the skills, confidence and networks to turn challenges into opportunities and contribute to more inclusive communities.',
    valuesEyebrow:'Our guiding ideas', valuesTitle:'Purpose, practice and people.', valuesDescription:'A simple framework for how this concept presents YSSE’s public mission.',
    value1Title:'Empowerment', value1Text:'Equip young people with skills, confidence and meaningful opportunities.', value2Title:'Inclusion', value2Text:'Make space for diverse voices, experiences and community needs.', value3Title:'Innovation', value3Text:'Encourage practical, creative approaches to social challenges.', value4Title:'Collaboration', value4Text:'Connect people and partners to make progress together.',
    image:'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1100&q=85'
  } ,
  pages: {
    departmentsEyebrow:'Find your place', departmentsTitle:'One purpose. Many ways to contribute.', departmentsDescription:'Explore the nine departments listed in YSSE’s virtual internship programme and discover where your interests may fit.',
    coursesEyebrow:'Learning & capacity building', coursesTitle:'Keep growing. Keep contributing.', coursesDescription:'Explore a sample catalogue of practical learning topics designed around collaboration, communication and social impact.',
    announcementsEyebrow:'News & updates', announcementsTitle:'The latest from the community.', announcementsDescription:'A place for verified programme news, learning opportunities, event notices and stories of impact.',
    internshipsEyebrow:'Virtual internship programme', internshipsTitle:'Put your skills to work for change.', internshipsDescription:'Explore role cards and learn about the application journey. Confirm current openings and deadlines through YSSE’s official internship portal.',
    contactEyebrow:'Get in touch', contactTitle:'Start a conversation.', contactDescription:'Use this form to send an enquiry. Messages are stored in the site database for administrators to review.', contactBlockEyebrow:'Connect with YSSE', contactBlockTitle:'Let’s make good things happen.', contactBlockText:'For current programmes, partnerships, volunteering or internship queries, check the official website before contacting the organisation.', contactFormTitle:'Send an enquiry', contactEmail:'ysseglobal@gmail.com', contactPhone:'+880 1713-143739', officialUrl:'https://ysseglobal.org/', facebookUrl:'https://www.facebook.com/share/1d7szMfqRa/?mibextid=wwXIfr', internshipUrl:'https://internship.ysseglobal.org/'
  }

};
