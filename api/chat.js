// POST /api/chat — streams an AI answer about Krish as plain text.
// Runs as a Vercel serverless function in production and inside the Vite dev
// server locally (see vite.config.js).
//
// Provider: Claude if ANTHROPIC_API_KEY is set, otherwise Groq if GROQ_API_KEY is set.
// With neither, it answers 503 and the chat widget falls back to its built-in answers.
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './_systemPrompt.js'
import { links } from '../src/data.js'

const CLAUDE_MODEL = 'claude-opus-5-5'
const GROQ_MODEL = 'openai/gpt-oss-120b'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Answers are a few sentences; the cap also bounds the cost of a public endpoint.
const MAX_TOKENS = 1024
const MAX_TURNS = 12 // only the most recent messages are sent
const MAX_CHARS = 1000 // per visitor message

const refusalNote = `Sorry, I can't help with that one. Feel free to ask about Krish's projects, skills or experience — or email him at ${links.email}.`

let anthropic
function getAnthropic() {
  // Created on first use so a missing key gives a clear error instead of crashing the module.
  anthropic ??= new Anthropic()
  return anthropic
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body // already parsed (Vercel)
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 50_000) throw new Error('Body too large')
  }
  return JSON.parse(raw || '{}')
}

// Keep only well-formed text turns, starting with a visitor message and ending with one.
function cleanMessages(input) {
  if (!Array.isArray(input)) return null
  let messages = input
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS)
  while (messages.length && messages[0].role !== 'user') messages = messages.slice(1)
  if (!messages.length || messages.at(-1).role !== 'user') return null
  return messages
}

function sendError(res, status, message) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ error: message }))
}

// Sends the streaming headers on the first piece of text, then writes text as it arrives.
function textWriter(res) {
  let started = false
  return {
    get started() {
      return started
    },
    write(text) {
      if (!text) return
      if (!started) {
        started = true
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Cache-Control', 'no-cache, no-transform')
        res.setHeader('X-Accel-Buffering', 'no')
      }
      res.write(text)
    },
  }
}

// ---------- Claude ----------
async function streamClaude(messages, res) {
  const stream = getAnthropic().beta.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    output_config: { effort: 'low' }, // short factual answers; keeps replies fast
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages,
    // If a safety classifier declines a harmless question, retry on Anthropic's recommended model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  })

  // Stop generating (and paying) if the visitor closes the chat mid-answer.
  res.on('close', () => {
    if (!res.writableFinished) stream.abort()
  })

  const out = textWriter(res)
  stream.on('text', (text) => out.write(text))

  try {
    const message = await stream.finalMessage()
    if (message.stop_reason === 'refusal') {
      out.write(out.started ? `\n\n${refusalNote}` : refusalNote)
      return res.end()
    }
    if (!out.started) return sendError(res, 502, 'Empty answer')
    res.end(message.stop_reason === 'max_tokens' ? '…' : '')
  } catch (error) {
    if (stream.aborted) return
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('[chat] Invalid or missing ANTHROPIC_API_KEY')
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error('[chat] Rate limited by the Claude API')
    } else if (error instanceof Anthropic.APIError) {
      console.error(`[chat] Claude API error ${error.status}:`, error.message)
    } else {
      console.error('[chat] Unexpected error:', error)
    }
    if (out.started) return res.end('\n\n[The answer was cut off — please try again.]')
    const status = error instanceof Anthropic.RateLimitError ? 429 : 502
    sendError(res, status, 'The assistant is unavailable right now')
  }
}

// ---------- Groq (OpenAI-compatible API, free tier) ----------
async function streamGroq(messages, res) {
  const controller = new AbortController()
  res.on('close', () => {
    if (!res.writableFinished) controller.abort()
  })

  const out = textWriter(res)
  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        stream: true,
        max_completion_tokens: MAX_TOKENS,
        reasoning_effort: 'low', // short factual answers; keeps replies fast
        include_reasoning: false, // only the answer, not the model's reasoning
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    })

    if (!response.ok || !response.body) {
      const detail = (await response.text().catch(() => '')).slice(0, 300)
      if (response.status === 401) console.error('[chat] Invalid GROQ_API_KEY')
      else if (response.status === 429) console.error('[chat] Rate limited by Groq (free-tier limit reached)')
      else console.error(`[chat] Groq API error ${response.status}: ${detail}`)
      return sendError(res, response.status === 429 ? 429 : 502, 'The assistant is unavailable right now')
    }

    // Server-sent events: lines of `data: {json}`, ending with `data: [DONE]`.
    const decoder = new TextDecoder()
    let buffer = ''
    let finish = null
    for await (const chunk of response.body) {
      buffer += decoder.decode(chunk, { stream: true })
      let newline
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trim()
        buffer = buffer.slice(newline + 1)
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') continue
        const choice = JSON.parse(data).choices?.[0]
        out.write(choice?.delta?.content)
        finish = choice?.finish_reason ?? finish
      }
    }

    if (!out.started) return sendError(res, 502, 'Empty answer')
    res.end(finish === 'length' ? '…' : '')
  } catch (error) {
    if (controller.signal.aborted) return
    console.error('[chat] Groq request failed:', error)
    if (out.started) return res.end('\n\n[The answer was cut off — please try again.]')
    sendError(res, 502, 'The assistant is unavailable right now')
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  let messages
  try {
    messages = cleanMessages((await readBody(req)).messages)
  } catch {
    return sendError(res, 400, 'Invalid request')
  }
  if (!messages) return sendError(res, 400, 'Send at least one question')

  if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) return streamClaude(messages, res)
  if (process.env.GROQ_API_KEY) return streamGroq(messages, res)

  console.error('[chat] No AI key set — add GROQ_API_KEY or ANTHROPIC_API_KEY to .env.local (or your host settings)')
  return sendError(res, 503, 'The assistant is not set up yet')
}
