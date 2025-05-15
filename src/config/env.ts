// Environment variables type definitions
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Environment configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL']

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

export default config