// All site content lives here — edit this file to update the portfolio.

export const links = {
  email: 'krish-prafulbhai.bavarva@epitech.eu',
  phone: '07 69 69 61 22',
  linkedin: 'https://www.linkedin.com/in/krish-bavarva',
  github: 'https://github.com/krishbavarva',
}

// Contact form delivery via EmailJS (https://dashboard.emailjs.com). These IDs are meant to be
// public, so they're safe in the code. Until serviceId and publicKey are filled in, the form
// opens a pre-filled email to you instead of sending directly.
// The visitor's confirmation email uses the "Auto-Reply" template (template_bhi83mj): link it in
// EmailJS → Email Templates → Contact Us → Auto-Reply tab, and EmailJS sends it automatically.
export const contactForm = {
  serviceId: '', // Email Services → e.g. 'service_abc1234'
  templateId: 'template_lslnn49', // "Contact Us" template
  publicKey: '', // Account → General → Public Key
  topics: ['Alternance', 'Freelance project', 'Just saying hi'],
}

// The "Download CV" menu. Files live in public/cv/.
export const cvs = [
  { label: 'Full-Stack', note: 'JavaScript / Elixir', file: '/cv/Bavarva_Krish_CV_FullStack.pdf' },
  { label: 'Frontend', note: 'React / Vue.js', file: '/cv/Bavarva_Krish_CV_Frontend.pdf' },
  { label: 'UX/UI Designer', note: 'who can also build it', file: '/cv/Bavarva_Krish_CV_UXUI.pdf' },
  { label: 'IoT & Web', note: 'Arduino, Unity + web apps', file: '/cv/Bavarva_Krish_CV_IoT_Web.pdf' },
]

export const stats = [
  { value: '10+', label: 'Projects built' },
  { value: 'Figma → Prod', label: 'Design and code, end to end' },
  { value: 'EN · FR · HI · GU', label: 'Languages I speak' },
]

// Add `image: '/projects/name.jpg'` (file in public/projects/) to show a screenshot;
// until then the card shows the `sketch` emoji as a doodled placeholder.
export const projects = [
  {
    title: 'Grocery Web',
    sketch: '🛒',
    subtitle: 'Role-based grocery platform',
    description:
      'A full MERN platform that connects five user roles — admins, managers, employees, delivery staff and customers — each with their own access and views. I designed the interface in Figma first, then built it.',
    highlights: [
      'Role-based access for 5 user types',
      'Smart product filtering for simpler navigation',
      'Order management for every user type',
    ],
    tags: ['Figma', 'MongoDB', 'Express', 'React', 'Node.js'],
    year: 'MERN',
    href: 'https://github.com/krishbavarva/2-1-2-FreshCart-',
  },
  {
    title: 'Time Manager',
    sketch: '⏱️',
    subtitle: 'Employee attendance platform',
    description:
      'An all-in-one employee attendance platform with a Vue.js frontend, an Elixir backend and a PostgreSQL database. Designed in Figma, then developed end to end.',
    highlights: [
      'Location-based clock-in',
      'Payroll and payment processes built into the system',
      'Vue.js frontend on an Elixir / PostgreSQL backend',
    ],
    tags: ['Figma', 'Vue.js', 'Elixir', 'PostgreSQL'],
    year: 'Epitech',
    href: 'https://github.com/krishbavarva/Time_manager_full',
  },
  {
    title: 'Trippo',
    sketch: '✈️',
    subtitle: 'Budget trip planner',
    description:
      'A responsive trip-planning web app that makes organising travel smooth: users create custom trips and keep their budget under control. Screens designed in Figma, then built with the MERN stack.',
    highlights: [
      'Create and customise trips',
      'Budget tracking per trip',
      'Responsive on mobile and desktop',
    ],
    tags: ['Figma', 'MongoDB', 'Express', 'React', 'Node.js'],
    year: 'MERN',
    href: 'https://github.com/krishbavarva/Trip-Travel-Planner-',
  },
  {
    title: 'Path Finder',
    sketch: '🚛',
    subtitle: 'Smart waste collection (IoT)',
    description:
      'An Arduino circuit with 3 sensors, one on each of 3 dustbins, detects when a bin needs emptying. The sensors are connected to a Unity app with a road map — when one triggers, a garbage truck drives to that bin, collects the garbage and returns to base.',
    highlights: [
      'Hardware, real-time signals and 3D simulation in one system',
      'Automatic truck routing in Unity',
      'Team project',
    ],
    tags: ['Arduino', 'C++', 'Sensors', 'Unity'],
    year: 'IoT',
    href: 'https://github.com/krishbavarva/Path_Finder',
  },
]

export const skills = [
  {
    group: 'Frontend',
    items: ['React.js', 'Vue.js', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'],
  },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'Elixir', 'MERN stack', 'Git / GitHub'] },
  { group: 'Databases', items: ['MongoDB', 'PostgreSQL'] },
  {
    group: 'Design',
    items: ['Figma', 'UX/UI', 'Wireframing', 'Prototyping', 'Responsive design'],
  },
]

export const process = [
  {
    step: '01',
    title: 'Understand',
    text: 'I start with the people who will use the product: who they are, what they need and what the product has to do for them. Clear goals make every later decision easier.',
  },
  {
    step: '02',
    title: 'Design in Figma',
    text: 'Wireframes first, then screens built from reusable components. I design responsive layouts with clear navigation and visual consistency, so the handoff to code is smooth.',
  },
  {
    step: '03',
    title: 'Build',
    text: 'I turn the design into a working product: React or Vue.js on the frontend, Node.js, Express or Elixir on the backend, with MongoDB or PostgreSQL behind it.',
  },
  {
    step: '04',
    title: 'Refine & ship',
    text: 'I fix bugs, improve features and optimise the code for performance and a better user experience, and I deliver on time.',
  },
]

export const softSkills = ['Creativity', 'Teamwork', 'Communication', 'Problem solving', 'Project management']

export const experience = [
  {
    period: '03/2025 – 06/2025',
    role: 'Freelance Web Developer / UX/UI Designer',
    company: 'Freelance · Morbi, India',
    details:
      'Designed and built websites for clients, from the first Figma wireframes to the live site. For RoohPhotoFilms, I created a portfolio website that shows the photographer\'s work and makes it easy for clients to get in touch.',
    points: [
      'Designed client-focused websites in Figma, then built them with React and Tailwind CSS',
      'Delivered interactive, user-friendly and responsive interfaces on time',
    ],
    tags: ['Figma', 'React', 'Tailwind CSS', 'Web design'],
  },
  {
    period: '07/2024 – 10/2024',
    role: 'Frontend Web Developer',
    company: 'Levaral Solutions · Rajkot, India',
    details:
      "Worked in the front-end team on a dashboard for Levaral's services, focusing on clean, reusable UI and performance.",
    points: [
      'Developed a responsive dashboard with React.js and Tailwind CSS',
      'Created reusable components to improve UI consistency across the product',
      'Fixed bugs, improved features and optimised front-end code for better performance',
    ],
    tags: ['React.js', 'Tailwind CSS', 'Components'],
  },
  {
    period: '11/2022 – 04/2023',
    role: 'Assistant Programming Instructor',
    company: 'Master Koder · Morbi, India',
    details:
      'Taught programming to students and helped them build their first real projects.',
    points: [
      'Mentored students in HTML, CSS, JavaScript and C++ for IoT',
      'Designed and built basic web and IoT projects for teaching',
      'Guided students through hands-on projects and real problem solving',
    ],
    tags: ['Teaching', 'C++', 'IoT', 'JavaScript'],
  },
  {
    period: '2023 – 2024',
    role: 'Event Manager, Squid Game event',
    company: 'MU Fest · Marwadi University',
    details:
      "Organised and ran the Squid Game event at MU Fest, Marwadi University's festival, for the 2023 and 2024 editions. Inspired by the series, it was a live elimination competition: 400+ participants played 6 solo and team games, players and teams were knocked out after each one, and the last game left just one winner.",
    points: [
      'Organised and managed 6 solo and team games for 400+ participants, two years in a row',
      'Planned the eliminations for every round, then recalculated live when results differed — e.g. if 200 eliminations were expected but only 150 happened, I adjusted the next games to stay on track',
      'Brought the competition down step by step, from 400+ players to the final 2 and one winner',
    ],
    tags: ['Event management', 'Planning', 'Problem solving', 'Teamwork', 'Communication'],
  },
]
