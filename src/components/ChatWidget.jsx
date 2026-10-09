import { useEffect, useRef, useState } from 'react'
import { MessageCircle, RotateCcw, Send, X } from 'lucide-react'
import { createLocalBot } from '../lib/localAnswers.js'

const greeting =
  "Hi! I'm Krish's assistant. Ask me anything about his projects, skills, experience or availability."

// Typing one of these starts a fresh conversation instead of asking the bot.
const clearCommands = ['clear', 'clear chat', 'new chat', 'new conversation', 'reset', 'restart', 'start over', 'start again', 'effacer', 'nouveau chat', 'recommencer']
const isClearCommand = (text) => clearCommands.includes(text.toLowerCase().replace(/[^a-z\s]/g, '').trim())

const suggestions = [
  'What kind of alternance is Krish looking for?',
  'What are his main skills?',
  'Tell me about his projects',
  'When is he available?',
]

// Speech bubble with a hand-drawn tail. Bot bubbles sit left (paper), visitor bubbles right (blue pen).
function Bubble({ from, children }) {
  const isUser = from === 'user'
  const fill = isUser ? '#2d5da1' : '#ffffff'
  return (
    <div
      className={`relative max-w-[85%] animate-fade-up rounded-wobbly border-2 border-pencil px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-hard-sm [overflow-wrap:anywhere] ${
        isUser ? 'self-end bg-pen text-white' : 'self-start bg-white'
      }`}
    >
      {children}
      <svg
        aria-hidden
        width="18"
        height="13"
        viewBox="0 0 18 13"
        className={`absolute -bottom-[11px] ${isUser ? 'right-6' : 'left-6'}`}
      >
        <polygon points="0,0 9,11 18,0" fill={fill} />
        <polyline points="1,1 9,11 17,1" fill="none" stroke="#2d2d2d" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  // Only real conversation turns go here; the greeting is UI only.
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(null)
  // Set once the AI endpoint says it isn't configured, so later questions skip straight to built-in answers.
  const [aiOff, setAiOff] = useState(false)
  // Built-in bot for this chat; it remembers the last topic so follow-ups work.
  const localBot = useRef(null)
  localBot.current ??= createLocalBot()
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, open])

  useEffect(() => () => abortRef.current?.abort(), [])

  // Wipes the conversation (and what the built-in bot remembers) and shows the greeting again.
  function newChat() {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setBusy(false)
    localBot.current = createLocalBot()
    inputRef.current?.focus()
  }

  async function send(text) {
    const question = text.trim()
    if (!question) return
    if (isClearCommand(question)) return newChat()
    if (busy) return
    setInput('')
    setBusy(true)

    const history = [...messages, { role: 'user', content: question }]
    setMessages([...history, { role: 'assistant', content: '' }])

    const controller = new AbortController()
    abortRef.current = controller

    const updateLast = (patch) =>
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { ...next[next.length - 1], ...patch }
        return next
      })

    // Types a built-in answer out a few characters at a time, like the AI would stream it.
    const typeOut = async (text) => {
      const step = Math.max(4, Math.ceil(text.length / 60)) // ~60 frames, so long answers don't drag
      for (let i = 0; i <= text.length; i += step) {
        if (controller.signal.aborted) return
        updateLast({ content: text.slice(0, i) })
        await new Promise((r) => setTimeout(r, 12))
      }
      updateLast({ content: text })
    }

    try {
      if (aiOff) {
        await new Promise((r) => setTimeout(r, 350))
        await typeOut(localBot.current(question))
        return
      }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        // 503 = no API key; 404 = static hosting with no server. Either way the AI won't come back this visit.
        if (response.status === 503 || response.status === 404) setAiOff(true)
        await typeOut(localBot.current(question))
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        updateLast({ content: answer })
      }
      answer += decoder.decode()
      if (!answer.trim()) await typeOut(localBot.current(question))
    } catch (error) {
      if (error.name !== 'AbortError') await typeOut(localBot.current(question))
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat — ask about Krish"
        aria-expanded={open}
        className={`fixed right-4 bottom-4 z-40 inline-flex min-h-12 -rotate-2 animate-fade-up items-center gap-2 rounded-wobbly border-[3px] border-pencil bg-postit px-5 font-hand text-lg shadow-hard transition-[translate,box-shadow,rotate,background-color,opacity] duration-100 [animation-delay:1.2s] hover:translate-x-[2px] hover:translate-y-[2px] hover:rotate-1 hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none md:right-6 md:bottom-6 ${
          open ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <MessageCircle strokeWidth={2.5} className="size-5" />
        Ask about Krish
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Chat with Krish's assistant"
          className="fixed inset-0 z-40 flex animate-pop-in flex-col overflow-hidden bg-paper md:inset-auto md:right-6 md:bottom-6 md:h-[min(600px,calc(100dvh-48px))] md:w-[390px] md:rounded-wobbly-md md:border-[3px] md:border-pencil md:shadow-hard-lg"
        >
          <header className="flex items-center gap-3 border-b-2 border-dashed border-pencil/50 bg-postit px-5 py-4">
            <span className="grid size-10 shrink-0 -rotate-3 place-items-center rounded-wobbly border-2 border-pencil bg-white font-display text-lg font-bold shadow-hard-sm">
              KB
            </span>
            <div>
              <p className="font-display text-xl leading-tight font-bold">Ask about Krish</p>
              <p className="font-hand text-base text-pencil/70">{aiOff ? 'Quick answers from his CV' : 'AI assistant · answers from his CV'}</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={newChat}
                aria-label="Start a new chat"
                title="New chat"
                className="ml-auto grid size-11 shrink-0 place-items-center rounded-blob border-2 border-pencil bg-white transition-[rotate,background-color,color] duration-100 hover:-rotate-45 hover:bg-pen hover:text-white"
              >
                <RotateCcw strokeWidth={3} className="size-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className={`${messages.length > 0 ? '' : 'ml-auto '}grid size-11 shrink-0 place-items-center rounded-blob border-2 border-pencil bg-white transition-[rotate,background-color,color] duration-100 hover:rotate-12 hover:bg-marker hover:text-white`}
            >
              <X strokeWidth={3} className="size-5" />
            </button>
          </header>

          <div
            ref={listRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:20px_20px] px-4 pt-5 pb-6"
          >
            <Bubble from="assistant">{greeting}</Bubble>
            {messages.map((m, i) => (
              <Bubble key={i} from={m.role}>
                {m.content || (
                  <span className="inline-flex gap-1.5 py-1.5" aria-label="Typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="size-2 animate-bounce rounded-full bg-pencil/60" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                )}
              </Bubble>
            ))}
            {messages.length === 0 && (
              <div className="mt-1 flex flex-col items-start gap-2.5">
                {suggestions.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className={`min-h-11 rounded-wobbly border-2 border-dashed border-pencil/60 bg-paper px-3.5 py-1.5 text-left font-hand text-lg transition-[rotate,border-color,color] duration-100 hover:border-solid hover:border-pen hover:text-pen ${
                      i % 2 ? 'hover:rotate-1' : 'hover:-rotate-1'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2.5 border-t-2 border-dashed border-pencil/50 bg-paper px-4 pt-3 pb-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={1000}
              aria-label="Your question"
              className="min-h-12 min-w-0 flex-1 rounded-wobbly border-2 border-pencil bg-white px-4 font-hand text-lg placeholder:text-pencil/40 focus:border-pen focus:ring-4 focus:ring-pen/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid size-12 shrink-0 place-items-center rounded-blob border-2 border-pencil bg-marker text-white shadow-hard-sm transition-[translate,box-shadow,opacity] duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-35"
            >
              <Send strokeWidth={2.5} className="size-5" />
            </button>
          </form>
          <p className="px-4 pb-3 text-center font-hand text-sm text-pencil/60">
            {aiOff ? 'Need more? Email Krish or download his CV.' : 'AI answers can be wrong — check the CV for details.'}
          </p>
        </section>
      )}
    </>
  )
}
