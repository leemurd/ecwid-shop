import axios from 'axios'

const storeId = import.meta.env.VITE_ECWID_STORE_ID || '108362264'
const token = import.meta.env.VITE_ECWID_PUBLIC_TOKEN || ''
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
const maxRetries = Number(import.meta.env.VITE_API_RETRY_MAX) || 3

export const api = axios.create({
  baseURL: `https://app.ecwid.com/api/v3/${storeId}`,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
  timeout,
})

api.interceptors.response.use(
  res => res,
  async error => {
    const config = error.config as any
    if (!config) return Promise.reject(error)

    config.__retryCount = config.__retryCount || 0
    if (config.__retryCount >= maxRetries) return Promise.reject(error)

    config.__retryCount += 1
    const delay = 200 * Math.pow(2, config.__retryCount - 1)
    await new Promise(r => setTimeout(r, delay))
    return api(config)
  }
)
