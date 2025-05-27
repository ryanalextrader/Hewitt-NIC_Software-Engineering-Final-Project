import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// function to create request to backend
const api = axios.create({
    // baseURL: import.meta.env.REACT_APP_API_URL
    baseURL: process.env.REACT_APP_API_URL // get api url from .env under root directory
})    

// function to check if user is allowed (authenticated) to access the api
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN); // check for access token stored locally
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error("Error:", error)
        return Promise.reject(error) // if no access token found, reject the api request
    }
)

export default api