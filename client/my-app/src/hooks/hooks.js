import { generateReportServices, generateReportStreamServices, registerServices, getTestimonialsServices, verifyOtpServices, resendOtpServices, loginServices, forgotPasswordServices, resetPasswordServices, refreshTokenServices, createTestimonialServices, getProjectsServices, deleteProjectServices } from "../services/Services"


const VERSION = import.meta.env.VITE_API_VERSION

export const useRegister = () => {
      return registerServices(`api${VERSION}/ai/auth/register`)
}

export const useGenerateReport = () => {
      return generateReportServices(`api${VERSION}/ai-analysis/generate-report`)
}

export const useReSendOtp = () => {
      return resendOtpServices(`api${VERSION}/ai/auth/send-otp`)
}

export const useVerifyOtp = () => {
      return verifyOtpServices(`api${VERSION}/ai/auth/verify-otp`)
}

export const useLogin = () => {
      return loginServices(`api${VERSION}/ai/auth/login`)
}

export const useForgotPassword = () => {
      return forgotPasswordServices(`api${VERSION}/ai/auth/forgot-password`)
}

export const useResetPassword = () => {
      return resetPasswordServices(`api${VERSION}/ai/auth/reset-password`)
}

export const useRefreshToken = () => {
      return refreshTokenServices(`api${VERSION}/ai/auth/refresh-token`)
}

export const useCreateTestimonial = () => {
      return createTestimonialServices(`api${VERSION}/testimonials/create-testimonial`)
}

export const useGetTestimonials = () => {
      return getTestimonialsServices(`api${VERSION}/testimonials`)
}

export const useGetProjects = (userId) => {
      if (!userId) return { data: [], isLoading: false }
      return getProjectsServices(`api${VERSION}/ai-analysis/projects/${userId}`)
}

export const useGenerateReportStream = (jobId)=>{
      return generateReportStreamServices(jobId ? `api${VERSION}/ai-analysis/stream/${jobId}` : "")
}

export const useDeleteProject = () => {
      return deleteProjectServices()
}