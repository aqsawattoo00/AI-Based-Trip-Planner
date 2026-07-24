import {useMutation, useQuery} from "@tanstack/react-query"
import {clientApi} from "../clientApi/ClientApi"
import {addUser} from "../redux/slice/authSlice"
import { useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react"

export const registerServices = (endpoint)=>{
    const dispatch = useDispatch()
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload),
        onSuccess:(data)=>{
            dispatch(addUser(data))
            const userId = data?.id
            const email = data?.email
            if(userId) localStorage.setItem("userId", userId)
            if(email)  localStorage.setItem("email", email)
        }
    })
}

export const verifyOtpServices = (endpoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload)
    })
}

export const resendOtpServices = (endpoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload)
    })
}

export const generateReportServices = (endPoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endPoint,payload)
    })
}

export const loginServices = (endpoint)=>{
    const dispatch = useDispatch()
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload),
        onSuccess:(data)=>{
            if(data?.ok && data?.data?.user){
                const user = data.data.user
                dispatch(addUser(user))
                if(user?.id)    localStorage.setItem("userId", user.id)
                if(user?.email) localStorage.setItem("email", user.email)
            }
        }
    })
}

export const forgotPasswordServices = (endpoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload)
    })
}

export const resetPasswordServices = (endpoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload)
    })
}


export const refreshTokenServices = (endpoint)=>{
    return useMutation({
        mutationFn:()=>clientApi.post(endpoint)
    })
}

export const createTestimonialServices = (endpoint)=>{
    return useMutation({
        mutationFn:(payload)=>clientApi.post(endpoint,payload)
    })
}

export const getTestimonialsServices = (endpoint)=>{
    return useQuery({
        queryKey:["testimonials"],
        queryFn:()=>clientApi.get(endpoint)
    })
}

export const getProjectsServices = (endpoint) => {
    return useQuery({
        queryKey: ["projects", endpoint],
        queryFn: () => clientApi.get(endpoint)
    })
}

export const deleteProjectServices = () => {
    return useMutation({
        mutationFn: ({ userId, projectId }) =>
            clientApi.delete(`api${import.meta.env.VITE_API_VERSION}/ai-analysis/projects/${userId}/${projectId}`)
    })
}


export const generateReportStreamServices = (endpoint)=>{
    const [data, setData] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const endpointRef = useRef(endpoint)

    useEffect(() => {
        endpointRef.current = endpoint
    }, [endpoint])

    useEffect(() => {
        if (!endpointRef.current) {
            setData("")
            setIsStreaming(false)
            return
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL
        const url = new URL(endpointRef.current, `${baseUrl}/`).toString()
        const eventSource = new EventSource(url)

        setData("")
        setIsStreaming(true)

        eventSource.onmessage = (event) => {
            const parsed = JSON.parse(event.data)
            if (parsed) {
                setData((prev) => prev + parsed)
            }
        }

        eventSource.addEventListener("done", () => {
            setIsStreaming(false)
            eventSource.close()
        })

        eventSource.onerror = () => {
            setIsStreaming(false)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [endpoint])

    return { data, isStreaming }
}