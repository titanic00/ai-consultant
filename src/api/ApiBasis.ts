import axios from 'axios';

export const apiBasis = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const apiBasisStorage = axios.create({
    baseURL: import.meta.env.VITE_STORAGE_API_URL
})