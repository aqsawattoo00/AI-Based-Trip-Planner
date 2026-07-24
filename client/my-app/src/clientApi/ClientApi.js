import axios from "axios"
import store from "../redux/store.js"
import { userData } from "../redux/slice/authSlice.js";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const getAccessToken = ()=>{
    const state = store.getState()
    const user = userData(state)
    if(!user){
        return undefined
    }
    return (
        user?.accessToken ||
        user?.token ||
        user?.data?.user?.accessToken ||
        user?.data?.user?.token
    )
}

axiosClient.interceptors.request.use((config)=>{
    const token = getAccessToken()
    if(token){
        config.headers = config.headers || {}
        if(!config.headers.Authorization){
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})
export const clientApi = {
    
    async get(url) {
        try {
            const response = await axiosClient.get(url)
            return response.data
        } catch (err) {
            return err
        }
    },
    async post(url, data) {
        try {
            const response = await axiosClient.post(url, data)
            return response.data
        } catch (err) {
            return err
        }
    },
    async put(url, data) {
        try {
            const response = await axiosClient.put(url, data)
            return response.data
        } catch (err) {
            return err
        }
    },
    async delete(url) {
        try {
            const response = await axiosClient.delete(url)
            return response.data
        } catch (err) {
            return err
        }
    }

}
