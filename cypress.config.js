import { defineConfig } from 'cypress'

const baseUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173'
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000/api'

export default defineConfig({
  allowCypressEnv: true,
  env: {
    apiUrl
  },

  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
