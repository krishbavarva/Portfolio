import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { contactForm, links } from '../data.js'
import Button from './ui/Button.jsx'
import Card from './ui/Card.jsx'

const field =
  'w-full rounded-wobbly border-2 border-pencil bg-white px-4 py-3 font-body text-base text-pencil ' +
  'placeholder:text-pencil/40 transition-[border-color,box-shadow] duration-100 ' +
  'focus:border-pen focus:ring-4 focus:ring-pen/20 focus:outline-none'
const label = 'mb-1.5 block font-hand text-xl'

// Opens the visitor's email (Gmail on desktop, mail app on phones) with the message filled in.
function openEmailDraft({ name, email, topic, message }) {
  const subject = `${topic} — from ${name}`
  const body = `${message}\n\n— ${name} (${email})`
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  const url = isTouch
    ? `mailto:${links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${links.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  if (isTouch) window.location.href = url
  else window.open(url, '_blank', 'noopener')
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', topic: contactForm.topics[0], message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | drafted | error
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    if (form.botcheck.checked) return // spam bots tick the hidden box; people never see it

    const { serviceId, templateId, publicKey } = contactForm
    if (!serviceId || !templateId || !publicKey) {
      openEmailDraft(values)
      setStatus('drafted')
      return
    }

    setStatus('sending')
    try {
      // EmailJS REST API. The params cover the variable names used by its "Contact Us" and
      // "Auto-Reply" templates ({{name}}, {{email}}, {{title}}, {{message}}, {{time}}).
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: values.name,
            email: values.email,
            title: values.topic,
            message: values.message,
            time: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
            from_name: values.name,
            from_email: values.email,
            reply_to: values.email,
          },
        }),
      })
      if (!response.ok) console.error('[contact] EmailJS error', response.status, await response.text().catch(() => ''))
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues({ name: '', email: '', topic: contactForm.topics[0], message: '' })
    setStatus('idle')
  }

  if (status === 'sent' || status === 'drafted') {
    return (
      <Card tone="postit" decoration="tack" className="rotate-1 p-8 text-center shadow-hard md:p-10" aria-live="polite">
        <CheckCircle2 strokeWidth={2.5} className="mx-auto size-12 text-pen" />
        <h3 className="mt-4 text-3xl">{status === 'sent' ? `Thanks, ${values.name.split(' ')[0]}!` : 'Almost there!'}</h3>
        <p className="mx-auto mt-3 max-w-sm text-lg leading-relaxed text-pencil/80">
          {status === 'sent'
            ? `Your message is on its way — a confirmation is heading to ${values.email}.`
            : 'Your email app opened with the message filled in — just press send there.'}
        </p>
        <Button variant="secondary" className="mt-6 -rotate-1" onClick={reset}>
          Write another message
        </Button>
      </Card>
    )
  }

  return (
    <Card as="form" decoration="tape" onSubmit={onSubmit} className="-rotate-[0.5deg] p-6 shadow-hard md:p-8">
      <p className="font-display text-2xl font-bold">Drop me a note</p>
      <p className="mt-1 font-hand text-lg text-pencil/70">Tell me about your team, project or role.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Your name
          </label>
          <input id="cf-name" name="name" required autoComplete="name" maxLength={100} value={values.name} onChange={set('name')} placeholder="Jane Doe" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Your email
          </label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" maxLength={200} value={values.email} onChange={set('email')} placeholder="jane@company.com" className={field} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={label}>What's it about?</legend>
        <div className="flex flex-wrap gap-2.5">
          {contactForm.topics.map((t, i) => {
            const active = values.topic === t
            return (
              <label
                key={t}
                className={`min-h-11 cursor-pointer rounded-wobbly border-2 border-pencil px-4 py-2 font-hand text-lg transition-[rotate,background-color,color] duration-100 has-focus-visible:ring-4 has-focus-visible:ring-pen/30 ${
                  active ? `bg-pencil text-paper ${i % 2 ? 'rotate-1' : '-rotate-1'}` : 'bg-white hover:bg-postit'
                }`}
              >
                <input type="radio" name="topic" value={t} checked={active} onChange={set('topic')} className="sr-only" />
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
          rows={5}
          maxLength={2000}
          value={values.message}
          onChange={set('message')}
          placeholder="Hi Krish, we have an alternance in our web team…"
          className={`${field} resize-y`}
        />
      </div>

      {/* Honeypot: hidden from people, filled in by spam bots */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status === 'error' && (
        <p className="mt-4 rounded-wobbly border-2 border-dashed border-marker bg-white px-4 py-2 font-hand text-lg" role="alert">
          Hmm, that didn't send. Please try again, or email me directly at{' '}
          <a href={`mailto:${links.email}`} className="text-pen underline">
            {links.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" variant="ink" className="mt-6 w-full sm:w-auto" disabled={status === 'sending'}>
        <Send strokeWidth={2.5} className="size-5" />
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </Button>
    </Card>
  )
}
