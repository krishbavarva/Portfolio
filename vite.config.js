import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves api/chat.js at /api/chat during `npm run dev`, the same way Vercel does in production.
function apiRoutes() {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const { default: handler } = await server.ssrLoadModule('/api/chat.js')
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(`[api/chat] ${error.stack ?? error}`)
          if (!res.headersSent) res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load ANTHROPIC_API_KEY from .env.local for the dev server. It has no VITE_ prefix,
  // so it is never bundled into the browser code.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY

  return {
    plugins: [react(), tailwindcss(), apiRoutes()],
  }
})
