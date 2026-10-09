// Built-in chat answers for when the AI isn't available (no API key, offline, rate-limited).
// It's a small rule-based bot: each topic has trigger words (English + French), a few ways
// of phrasing its reply, and optional follow-ups ("tell me more"). Facts come from data.js,
// so answers stay in sync with the site. To teach it something new, add a topic below.
import { cvs, experience, links, projects, skills, softSkills } from '../data.js'
import { drawings } from '../data/content.js'

// ---------- helpers ----------
const list = (items) => items.map((i) => `• ${i}`).join('\n')
const pick = (options) => options[Math.floor(Math.random() * options.length)]
const job = (keyword) => experience.find((j) => `${j.role} ${j.company}`.toLowerCase().includes(keyword))
const project = (keyword) => projects.find((p) => p.title.toLowerCase().includes(keyword))
const skillGroup = (name) => skills.find((s) => s.group.toLowerCase() === name)
const skillLine = (s) => `${s.group}: ${s.items.join(', ')}`

const describeJob = (j) => `${j.details}\n${list(j.points ?? [])}`
const describeProject = (p) =>
  `${p.title} is ${aOrAn(p.subtitle)} ${lowerFirst(p.subtitle)}. ${p.description}\n${list(p.highlights ?? [])}\nBuilt with ${p.tags.join(', ')}.${p.href ? `\nCode: ${p.href}` : ''}`
const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1)
const aOrAn = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

// Friendly openers for factual answers, so replies don't all start the same way.
const opener = () => pick(['', 'Sure! ', 'Good question. ', 'Happy to help. ', 'Of course. '])

// Ends a reply with a light nudge to keep the conversation going.
const nudge = () =>
  pick([
    '',
    '\n\nAnything else you’d like to know?',
    '\n\nWant to know more about any of these?',
    '',
  ])

// ---------- topics ----------
// `reply` returns the answer (strings may be picked at random); `more` answers a follow-up
// like "tell me more" right after this topic. Order matters only for ties: earlier wins.
const topics = [
  // --- specific experience ---
  {
    id: 'squid',
    words: ['squid', 'game', 'event', 'mu fest', 'fest', 'elimination', 'eliminations', 'participants', 'evenement'],
    reply: () => `${opener()}Krish was the Event Manager of the Squid Game event at MU Fest (Marwadi University) in 2023 and 2024.\n\n${describeJob(job('squid'))}`,
  },
  {
    id: 'levaral',
    words: ['levaral', 'dashboard'],
    reply: () => {
      const j = job('levaral')
      return `${opener()}At Levaral Solutions (Rajkot, India, ${j.period}) Krish worked as a Frontend Web Developer.\n\n${describeJob(j)}`
    },
  },
  {
    id: 'freelance',
    words: ['freelance', 'freelancer', 'rooh', 'roohphotofilms', 'client', 'clients', 'photographer'],
    reply: () => {
      const j = job('freelance')
      return `${opener()}From ${j.period} Krish worked freelance as a web developer and UX/UI designer.\n\n${describeJob(j)}`
    },
  },
  {
    id: 'teaching',
    words: ['master koder', 'koder', 'teach', 'teaching', 'taught', 'instructor', 'mentor', 'students', 'enseign'],
    reply: () => {
      const j = job('instructor')
      return `${opener()}Before his freelance and company work, Krish was an Assistant Programming Instructor at Master Koder (${j.period}).\n\n${describeJob(j)}`
    },
  },

  // --- specific projects ---
  ...projects.map((p) => ({
    id: `project:${p.title}`,
    words: projectWords(p),
    reply: () => `${opener()}${describeProject(p)}`,
  })),

  // --- the role he's looking for ---
  {
    id: 'alternance',
    words: ['alternance', 'looking', 'internship', 'intern', 'stage', 'work-study', 'apprentice', 'apprentissage', 'job', 'role', 'position', 'opportunity', 'cherche', 'recherche', 'poste', 'hire', 'hiring', 'recruit', 'recruiting'],
    reply: () =>
      pick([
        `Krish is looking for an alternance (or "stage alterné") in Paris, in web development or UX/UI. The rhythm is 4 weeks in the company and 2 weeks at school (Epitech), and he's available immediately.`,
        `He's searching for a work-study position — an alternance in Paris — in web development or UX/UI. It's 4 weeks at the company, 2 weeks at Epitech, and he can start right away.`,
      ]) + pick([`\n\nIf you have a role in mind, you can email him at ${links.email}.`, `\n\nInterested? His email is ${links.email}.`]),
    more: () =>
      `He'd fit best in a team building web products: frontend with React or Vue.js, full-stack JavaScript (Node.js/Express) or Elixir, or a UX/UI role where he designs in Figma and also builds what he designs. His Master's at Epitech runs until 2027.`,
  },
  {
    id: 'available',
    words: ['available', 'availability', 'when', 'start', 'starting', 'disponible', 'disponibilite', 'quand', 'rhythm', 'rythme', 'schedule', 'calendar'],
    reply: () =>
      pick([
        `He's available immediately. During the alternance he'd be 4 weeks in the company and 2 weeks at school, until his Master's ends in 2027.`,
        `Right away! The schedule would be 4 weeks with you, then 2 weeks at Epitech, repeating until 2027.`,
      ]),
  },

  // --- skills ---
  {
    id: 'frontend',
    words: ['frontend', 'front-end', 'react', 'vue', 'vuejs', 'reactjs', 'javascript', 'js', 'tailwind', 'html', 'css'],
    reply: () =>
      `${pick(['Yes! ', 'Definitely. ', ''])}Frontend is his strongest side: ${skillGroup('frontend').items.join(', ')}. He used React with Tailwind CSS at Levaral Solutions and in his freelance work, and Vue.js for the Time Manager project.`,
    more: () => `On the frontend he focuses on responsive layouts, reusable components and UI consistency — he designs the screens in Figma first, then builds them.`,
  },
  {
    id: 'backend',
    words: ['backend', 'back-end', 'node', 'nodejs', 'express', 'elixir', 'api', 'apis', 'server', 'mern', 'full-stack', 'fullstack'],
    reply: () =>
      `${opener()}On the backend he works with ${skillGroup('backend').items.slice(0, 3).join(', ')}, with ${skillGroup('databases').items.join(' and ')} for data. He's built full MERN apps (Grocery Web, Trippo) and an Elixir + PostgreSQL backend for Time Manager.`,
    more: () => `Some backend features he's built: role-based access for 5 user types (Grocery Web), payroll and location-based clock-in (Time Manager), and budget tracking (Trippo).`,
  },
  {
    id: 'databases',
    words: ['database', 'databases', 'mongodb', 'mongo', 'postgres', 'postgresql', 'sql', 'nosql', 'base de donnees'],
    reply: () => `${opener()}He uses ${skillGroup('databases').items.join(' and ')} — MongoDB in his MERN projects (Grocery Web, Trippo) and PostgreSQL with Elixir in Time Manager.`,
  },
  {
    id: 'design',
    words: ['design', 'designer', 'figma', 'ux', 'ui', 'wireframe', 'wireframes', 'prototype', 'prototyping', 'maquette'],
    reply: () =>
      `${opener()}Design is half of what he does: ${skillGroup('design').items.join(', ')}. He designs every interface in Figma first, then builds it himself in React or Vue.js — so nothing gets lost between design and code.`,
    more: () => `Drawing and photography are big hobbies of his, and he says they shaped his eye for detail. You can see his drawings on the Art page.`,
  },
  {
    id: 'skills',
    words: ['skill', 'skills', 'stack', 'tech', 'technologies', 'technology', 'tools', 'know', 'competences', 'competence', 'outils'],
    reply: () => `${opener()}Here's what Krish works with:\n${list(skills.map(skillLine))}${nudge()}`,
    more: () => `He's also worked with Arduino, sensors and C++ for IoT, and Unity for a 3D simulation (the Path Finder project). Soft skills: ${softSkills.join(', ').toLowerCase()}.`,
  },

  // --- overviews ---
  {
    id: 'projects',
    words: ['project', 'projects', 'built', 'build', 'portfolio', 'github', 'code', 'apps', 'projet', 'projets', 'realisations'],
    reply: () =>
      `${opener()}Here are his main projects:\n${list(projects.map((p) => `${p.title} — ${lowerFirst(p.subtitle)} (${p.tags.slice(0, 3).join(', ')})`))}\n\nAsk me about any of them for the details!`,
    more: () => `Quick highlights:\n${list(projects.map((p) => `${p.title}: ${(p.highlights ?? [])[0] ?? p.subtitle}`))}`,
  },
  {
    id: 'experience',
    words: ['experience', 'experiences', 'worked', 'work', 'company', 'companies', 'career', 'background', 'emploi', 'entreprise', 'parcours'],
    reply: () =>
      `${opener()}Here's his experience so far:\n${list(experience.map((j) => `${j.role} — ${j.company.split(' · ')[0]} (${j.period})`))}\n\nAsk about any of them and I'll tell you more.`,
  },
  {
    id: 'education',
    words: ['education', 'study', 'studies', 'studying', 'degree', 'school', 'university', 'college', 'epitech', 'master', 'masters', 'bachelor', 'marwadi', 'etudes', 'formation', 'diplome', 'ecole'],
    reply: () =>
      `${opener()}He's doing a Master's in Information Technology at Epitech Paris (2025 – 2027), after a Bachelor's in Computer Engineering at Marwadi University in Rajkot, India (2021 – 2025).`,
  },
  {
    id: 'languages',
    words: ['language', 'languages', 'speak', 'english', 'french', 'hindi', 'gujarati', 'langue', 'langues', 'francais', 'anglais'],
    reply: () =>
      pick([
        `He speaks English (C1), French (B1), and Hindi and Gujarati as native languages.`,
        `Four languages: English at C1, French at B1, plus Hindi and Gujarati (native).`,
      ]),
  },
  {
    id: 'cv',
    words: ['cv', 'resume', 'pdf', 'download', 'telecharger'],
    reply: () =>
      `${opener()}You can grab his CV from the "Download CV" button at the top of the page. There are ${cvs.length} versions, so you can pick the one closest to your role:\n${list(cvs.map((c) => `${c.label} — ${c.note}`))}`,
  },
  {
    id: 'contact',
    words: ['contact', 'email', 'mail', 'reach', 'linkedin', 'phone', 'call', 'talk', 'meet', 'interview', 'joindre', 'contacter', 'telephone'],
    reply: () =>
      pick([
        `The best way is email: ${links.email}\nYou can also find him on LinkedIn: ${links.linkedin}`,
        `Email works best — ${links.email}. He's also on LinkedIn (${links.linkedin}) and GitHub (${links.github}).`,
      ]),
  },
  {
    id: 'location',
    words: ['where', 'location', 'live', 'lives', 'based', 'city', 'paris', 'drancy', 'france', 'india', 'from', 'ou', 'habite'],
    reply: () => `Krish is originally from India and now lives in Drancy, just outside Paris. He studies at Epitech Paris.`,
  },
  {
    id: 'hobbies',
    words: ['draw', 'drawing', 'drawings', 'art', 'artist', 'sketch', 'hobby', 'hobbies', 'free time', 'passion', 'passions', 'photo', 'photography', 'sport', 'sports', 'cricket', 'dessin', 'loisirs'],
    reply: () =>
      `Outside of code he draws a lot — pencil, charcoal and digital (like ${drawings.slice(0, 3).map((d) => d.title).join(', ')}). They're on the Art page! He also enjoys photography, swimming, cricket, volleyball and badminton, and exploring historic places.`,
  },
  {
    id: 'softskills',
    words: ['strength', 'strengths', 'soft', 'personality', 'qualities', 'teamwork', 'leader', 'leadership', 'qualites', 'points forts', 'why hire', 'why him'],
    reply: () =>
      `${opener()}His soft skills: ${softSkills.join(', ').toLowerCase()}. A few things that show it: he taught programming at Master Koder, and he ran the Squid Game event for 400+ participants two years in a row, recalculating eliminations live when results didn't go to plan.`,
  },
  {
    id: 'about',
    words: ['who', 'krish', 'him', 'introduce', 'summary', 'overview', 'qui', 'presente', 'profil', 'profile'],
    reply: () =>
      pick([
        `Krish Bavarva is a full-stack developer and UX/UI designer from India, now in Paris, doing a Master's at Epitech. He designs interfaces in Figma and builds them with React, Vue.js, Node.js and Elixir. He's looking for an alternance and is available now.`,
        `In short: Krish designs products in Figma and builds them too — frontend (React, Vue.js) and backend (Node.js, Elixir). He's a Master's student at Epitech Paris, looking for an alternance in web development or UX/UI.`,
      ]) + nudge(),
  },

  // --- small talk (last, so real questions win ties) ---
  {
    id: 'me',
    words: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'bot', 'robot', 'chatgpt', 'claude', 'human', 'real person', 'your name'],
    reply: () => `I'm Krish's little assistant on this site. I know what's on his portfolio and CV — his projects, skills, experience and availability — so ask away! For anything else, Krish himself is at ${links.email}.`,
  },
  {
    id: 'help',
    words: ['help', 'what can you', 'what can i ask', 'options', 'questions', 'aide'],
    reply: () => `I can tell you about:\n${list(['the alternance Krish is looking for', 'his skills (frontend, backend, design)', 'his projects and experience', 'his education and languages', 'his CV and how to contact him'])}\n\nTry "What has he built with React?" or "When can he start?" — and type "clear" anytime to start a new chat.`,
  },
  {
    id: 'howareyou',
    words: ['how are you', 'how is it going', 'hows it going', 'how do you do', 'ca va', 'comment ca va'],
    reply: () => pick([`I'm doing great, thanks for asking! What would you like to know about Krish?`, `All good here! Curious about Krish's work? Ask me anything.`]),
  },
  {
    id: 'compliment',
    words: ['impressive', 'amazing', 'awesome', 'love', 'beautiful', 'nice portfolio', 'great portfolio', 'good portfolio', 'well done', 'talented', 'genial', 'bravo', 'super'],
    reply: () => pick([`Thank you — I'll pass that on to Krish, he'll be happy to hear it! 😊`, `That's kind of you! Krish designed and built this whole site himself — sketched in Figma, coded in React.`]),
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank', 'thx', 'merci', 'appreciate'],
    reply: () => pick([`You're welcome! Anything else you'd like to know?`, `Happy to help! Feel free to ask anything else.`, `Anytime! And if you'd like to talk to Krish directly: ${links.email}`]),
  },
  {
    id: 'bye',
    words: ['no thanks', 'no thank you', 'bye', 'goodbye', 'see you', 'see ya', 'later', 'ciao', 'au revoir', 'a bientot', 'good night', 'have a nice day'],
    reply: () => pick([`Bye, and thanks for stopping by! 👋`, `See you! If something comes up, Krish is at ${links.email}.`, `Take care — thanks for visiting Krish's portfolio!`]),
  },
  {
    id: 'ack',
    words: ['no problem', 'no worries', 'ok', 'okay', 'k', 'sure', 'alright', 'got it', 'cool', 'nice', 'great', 'good', 'perfect', 'noted', 'will do', 'i will', 'future', 'soon', 'maybe', 'later', 'yes', 'yeah', 'yep', 'no', 'nope', 'hmm', 'd accord', 'daccord', 'oui', 'non'],
    reply: () =>
      pick([
        `Sounds good! Whenever you're ready, Krish's inbox is open: ${links.email}. Anything else I can help with?`,
        `Great! Feel free to come back anytime — and if you have more questions, I'm right here.`,
        `👍 No rush. If you'd like to know anything else about Krish, just ask.`,
      ]),
  },
  {
    id: 'hello',
    words: ['hi', 'hello', 'hey', 'hii', 'yo', 'bonjour', 'salut', 'namaste', 'hola', 'good morning', 'good evening'],
    reply: () => pick([`Hi there! 👋 What would you like to know about Krish?`, `Hello! Ask me about Krish's projects, skills, experience or availability.`, `Hey! I can tell you all about Krish's work — where should we start?`]),
  },
]

function projectWords(p) {
  const extra = {
    'Grocery Web': ['grocery', 'freshcart', 'groceries', 'epicerie', 'role-based'],
    'Time Manager': ['time manager', 'attendance', 'payroll', 'clock-in', 'clock', 'employees'],
    Trippo: ['trippo', 'trip', 'travel', 'voyage', 'planner'],
    'Path Finder': ['path finder', 'pathfinder', 'iot', 'arduino', 'unity', 'sensor', 'sensors', 'waste', 'hardware', 'c++'],
  }
  return extra[p.title] ?? [p.title.toLowerCase()]
}

// Words that mean "continue with what we were just talking about".
const followUps = ['more', 'tell me more', 'details', 'detail', 'explain', 'elaborate', 'what else', 'go on', 'continue', 'encore', 'en savoir plus']

const fallbacks = () =>
  pick([
    `Hmm, I'm not sure about that one. I know about Krish's projects, skills, experience, education and availability — try asking "What has he built?" or "When can he start?". For anything else: ${links.email}.`,
    `Good question, but I don't have that information. Krish can answer it himself at ${links.email}. Meanwhile, I can tell you about his projects or skills!`,
    `I don't know that one, sorry! Try asking about his React experience, his projects, or the alternance he's looking for.`,
  ])

// ---------- matching ----------
const normalize = (text) =>
  ` ${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9+#\s-]/g, ' ')
    .replace(/\s+/g, ' ')} `

// Returns the form of `phrase` found in the question (itself, or with -s / -es), or null.
// So "art" also matches "arts" and "skill" matches "skills".
const matchForm = (q, phrase) => {
  const w = normalize(phrase).trim()
  return [w, `${w}s`, `${w}es`].find((form) => q.includes(` ${form} `)) ?? null
}

// Drop the word right after a negation, so "not projects, arts" is about art, not projects.
// Filler words (the, his, any…) after the negation are skipped first.
const negations = ['not', 'no', 'dont', 'don t', 'without', 'except', 'instead of', 'pas', 'sans', 'sauf']
const fillers = ['the', 'his', 'a', 'an', 'any', 'about', 'want', 'need', 'like', 'care', 'see', 'les', 'le', 'la', 'des', 'de', 'ses', 'veux']
// Never negated away: "no thanks", "no problem".
const keepAfterNegation = ['thanks', 'thank', 'problem', 'worries', 'merci']
function dropNegated(q) {
  const tokens = q.trim().split(' ')
  const kept = []
  for (let i = 0; i < tokens.length; i++) {
    const two = `${tokens[i]} ${tokens[i + 1] ?? ''}`
    const neg = negations.find((n) => n === tokens[i] || n === two)
    if (!neg || keepAfterNegation.includes(tokens[i + neg.split(' ').length])) {
      kept.push(tokens[i])
      continue
    }
    i += neg.split(' ').length - 1 // skip the negation itself
    while (fillers.includes(tokens[i + 1])) i++
    i++ // …and the negated word
  }
  return ` ${kept.join(' ')} `
}

function score(q, words) {
  // Each word of the question counts once (so "skills" isn't counted for both "skill" and "skills");
  // longer phrases count more.
  const found = new Set(words.map((w) => matchForm(q, w)).filter(Boolean))
  return [...found].reduce((sum, form) => sum + form.split(' ').length, 0)
}

// One bot per chat: it remembers the last topic so follow-ups work.
export function createLocalBot() {
  let lastTopic = null

  return function answer(question) {
    const raw = normalize(question)
    const q = dropNegated(raw)

    let best = null
    let bestScore = 0
    for (const topic of topics) {
      const s = score(q, topic.words)
      if (s > bestScore) {
        best = topic
        bestScore = s
      }
    }

    // "tell me more" / "and?" with no clear new topic → continue the last one.
    const isFollowUp = score(q, followUps) > 0
    const smallTalk = best && ['ack', 'thanks', 'bye', 'hello', 'howareyou', 'compliment'].includes(best.id)
    if (isFollowUp && lastTopic && (!best || smallTalk)) {
      const text = lastTopic.more ? lastTopic.more() : `That's the main thing about it! You can also ask me about his ${pick(['projects', 'skills', 'experience', 'availability'])}.`
      return text
    }

    if (!best) return fallbacks()
    if (!['ack', 'thanks', 'bye', 'hello', 'howareyou', 'compliment', 'me', 'help'].includes(best.id)) lastTopic = best
    return best.reply()
  }
}

// Stateless one-off answer (kept for simple use).
export const localAnswer = (question) => createLocalBot()(question)
