import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { CheckCircle2, Send } from 'lucide-react'
import { links } from '../data.js'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'

// EmailJS keys come from environment variables (.env.local locally, Vercel settings in production).
// Vite only exposes variables starting with VITE_ to the browser. These are public IDs, not secrets.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const configured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

const field =
  'w-full rounded-wobbly border-2 border-pencil bg-white px-4 py-3 font-body text-base text-pencil ' +
  'placeholder:text-pencil/40 transition-[border-color,box-shadow] duration-100 ' +
  'focus:border-pen focus:ring-4 focus:ring-pen/20 focus:outline-none'
const label = 'mb-1.5 block font-hand text-xl'

// Sent as the `title` field ({{title}} in the EmailJS template).
const topics = ['Alternance', 'Freelance project', 'Just saying hi']

// Until EmailJS is configured: open the visitor's email (Gmail on desktop, mail app on phones)
// with the message filled in, so the form is never a dead end.
function openEmailDraft({ from_name, reply_to, title, message }) {
  const subject = `${title} — from ${from_name}`
  const body = `${message}\n\n— ${from_name} (${reply_to})`
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const url = isTouch
    ? `mailto:${links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${links.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  if (isTouch) window.location.href = url
  else window.open(url, '_blank', 'noopener')
}

export default function ContactForm() {
  const formRef = useRef(null)
  const timeRef = useRef(null)
  const botRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | drafted | error
  const [topic, setTopic] = useState(topics[0])
  const [sentTo, setSentTo] = useState({ name: '', email: '' })

  async function onSubmit(e) {
    e.preventDefault()
    if (botRef.current?.checked) return // spam bots tick the hidden box; people never see it

    const form = formRef.current
    const data = Object.fromEntries(new FormData(form))
    setSentTo({ name: data.from_name, email: data.reply_to })

    if (!configured) {
      openEmailDraft(data)
      setStatus('drafted')
      return
    }

    // Hidden "time" field gets the current date/time just before sending.
    timeRef.current.value = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

    setStatus('sending')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY })
      form.reset()
      setStatus('sent')
    } catch (error) {
      console.error('[contact] EmailJS failed:', error?.text ?? error)
      setStatus('error')
    }
  }

  if (status === 'sent' || status === 'drafted') {
    return (
      <Card tone="postit" decoration="tack" className="rotate-1 p-8 text-center shadow-hard md:p-10" aria-live="polite">
        <CheckCircle2 strokeWidth={2.5} className="mx-auto size-12 text-pen" />
        <h3 className="mt-4 text-3xl">{status === 'sent' ? `Thanks, ${sentTo.name.split(' ')[0]}!` : 'Almost there!'}</h3>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pencil/80">
          {status === 'sent'
            ? `Your message was sent successfully. I'll get back to you at ${sentTo.email}.`
            : 'Your email app opened with the message filled in — just press send there.'}
        </p>
        <Button
          variant="secondary"
          className="mt-6 -rotate-1"
          onClick={() => {
            setTopic(topics[0])
            setStatus('idle')
          }}
        >
          Write another message
        </Button>
      </Card>
    )
  }

  return (
    <Card as="form" ref={formRef} decoration="tape" onSubmit={onSubmit} className="-rotate-[0.5deg] p-6 shadow-hard md:p-8">
      <p className="font-display text-2xl font-bold">Drop me a note</p>
      <p className="mt-1 font-hand text-lg text-pencil/70">Tell me about your team, project or role.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Your name
          </label>
          <input id="cf-name" name="from_name" type="text" required autoComplete="name" maxLength={100} placeholder="Jane Doe" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Your email
          </label>
          <input id="cf-email" name="reply_to" type="email" required autoComplete="email" maxLength={200} placeholder="jane@company.com" className={field} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={label}>What's it about?</legend>
        <div className="flex flex-wrap gap-2.5">
          {topics.map((t, i) => {
            const active = topic === t
            return (
              <label
                key={t}
                className={`min-h-11 cursor-pointer rounded-wobbly border-2 border-pencil px-4 py-2 font-hand text-lg transition-[rotate,background-color,color] duration-100 has-focus-visible:ring-4 has-focus-visible:ring-pen/30 ${
                  active ? `bg-pencil text-paper ${i % 2 ? 'rotate-1' : '-rotate-1'}` : 'bg-white hover:bg-postit'
                }`}
              >
                <input type="radio" name="title" value={t} checked={active} onChange={() => setTopic(t)} className="sr-only" />
                {t}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="cf-message" className={label}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          maxLength={2000}
          placeholder="Hi Krish, we have an alternance in our web team…"
          className={`${field} resize-y`}
        />
      </div>

      <input ref={timeRef} type="hidden" name="time" />
      {/* Honeypot (no name, so it's never sent): hidden from people, ticked by spam bots */}
      <input ref={botRef} type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === 'error' && (
        <p className="mt-4 rounded-wobbly border-2 border-dashed border-marker bg-white px-4 py-2 font-hand text-lg" role="alert">
          Sorry, the message couldn't be sent. Please try again, or email me directly at{' '}
          <a href={`mailto:${links.email}`} className="text-pen underline">
            {links.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" variant="ink" className="mt-6 w-full sm:w-auto" disabled={status === 'sending'}>
        <Send strokeWidth={2.5} className="size-5" />
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </Button>
    </Card>
  )
}
