import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core':   ['react', 'react-dom'],
            'motion':       ['motion'],
            'router':       ['react-router'],
            'icons':        ['lucide-react'],
            'charts':       ['recharts'],
            // Page-level chunks — each lazy route loads independently
            'tenant-app':   ['./src/app/pages/TenantApp'],
            'landlord-app': ['./src/app/pages/LandlordApp'],
            'admin-app':    ['./src/app/pages/AdminPanel'],
            'portals':      ['./src/app/pages/ManagerApp', './src/app/pages/DevApp'],
            'subpages':     [
              './src/app/pages/ContractsPage',
              './src/app/pages/PaymentsPage',
              './src/app/pages/ReportsPage',
              './src/app/pages/SecurityPage',
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: () => '/v1/messages',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.ANTHROPIC_API_KEY || ''
              proxyReq.setHeader('x-api-key', key)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
              proxyReq.removeHeader('origin')
            })
          },
        },
        // AI Agent backend (DungGiaIT/AI-integrated-apartments)
        // Run: python -m uvicorn app.main:app --reload  (port 8000)
        '/agent-api': {
          target: env.AGENT_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/agent-api/, ''),
        },
      },
    },
  }
})
