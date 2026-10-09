// POST /api/chat — streams Claude's answer about Krish as plain text.
// Runs as a Vercel serverless function in production and inside the Vite dev
// server locally (see vite.config.js). Needs ANTHROPIC_API_KEY in the environment.
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './_systemPrompt.js'
import { links } from '../src/data.js'

const MODEL = 'claude-opus-5-5'
// Answers are a few sentences; the cap also bounds the cost of a public endpoint.
const MAX_TOKENS = 1024
const MAX_TURNS = 12 // only the most recent messages are sent
const MAX_CHARS = 1000 // per visitor message

let client
function getClient() {
  // Created on first use so a missing key gives a clear error instead of crashing the module.
  client ??= new Anthropic()
  return client
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  let messages
  try {
    messages = cleanMessages((await readBody(req)).messages)
  } catch {
    return sendError(res, 400, 'Invalid request')
  }
  if (!messages) return sendError(res, 400, 'Send at least one question')

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.error('[chat] ANTHROPIC_API_KEY is not set — add it to .env.local (or your host settings)')
    return sendError(res, 503, 'The assistant is not set up yet')
  }

  const stream = getClient().beta.messages.stream({
    model: MODEL,
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

  let started = false
  stream.on('text', (text) => {
    if (!started) {
      started = true
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('X-Accel-Buffering', 'no')
    }
    res.write(text)
  })

  try {
    const message = await stream.finalMessage()
    if (message.stop_reason === 'refusal') {
      const note = `Sorry, I can't help with that one. Feel free to ask about Krish's projects, skills or experience — or email him at ${links.email}.`
      if (!started) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      }
      res.end(started ? `\n\n${note}` : note)
      return
    }
    if (!started) {
      // No text at all (shouldn't happen) — answer with something useful instead of nothing.
      return sendError(res, 502, 'Empty answer')
    }
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
    if (started) return res.end('\n\n[The answer was cut off — please try again.]')
    const status = error instanceof Anthropic.RateLimitError ? 429 : 502
    sendError(res, status, 'The assistant is unavailable right now')
  }
}
