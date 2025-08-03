import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://app.ecwid.com/api/v3/108362264',
  headers: {
    Authorization: 'Bearer public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})
