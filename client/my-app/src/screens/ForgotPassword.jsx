import React, { useState,useEffect } from "react";
import InputField from "../components/InputField.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../constant/YupSchema.js";
import { useForgotPassword,useResetPassword } from "../hooks/hooks.js"
import { useSelector } from "react-redux";
import { userData } from "../redux/slice/authSlice.js";



function ForgotPassword() {
  const location = useLocation();
  const fromPage = location.state?.from || "";
  const navigate = useNavigate();
  const currentStep = fromPage === "otp" ? 2 : 1;
  const [step, setStep] = useState(currentStep);
  const { mutateAsync: forgotPasswordAsync } = useForgotPassword()
  const { mutateAsync: resetPasswordAsync } = useResetPassword()
  const user = useSelector(userData)

useEffect(() => {
  console.log("Updated user:", user)
}, [user])


  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const moveOtpScreen = async (data) => {
    const result = await forgotPasswordAsync(data)
    if (result?.status === 200 && result?.ok === true) {
      navigate("/otp", { state: { from: "forgot-password" } });
    }
  }

  const resetPassword = async (data) => {
    const result = await resetPasswordAsync(data)

    if (result?.status === 200 && result?.ok === true) {
      navigate("/login", { state: { from: "reset-password" } });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 flex items-center justify-center">

      <div className="relative w-full max-w-md mt-4">

        <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/40 dark:border-white/10 overflow-hidden">

          <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500"></div>

          <div className="p-8">

            {/* Header */}
            <div className="text-center mb-8">

              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Forgot Password
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Reset your AI Trip Planner password
              </p>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleSubmitEmail(moveOtpScreen)}>

                <div className="group">
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/30 group-hover:border-green-400"
                    {...registerEmail("email")}
                    error={emailErrors?.email?.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                >
                  Continue
                </button>

              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form className="space-y-6" onSubmit={handleSubmitReset(resetPassword)}>

                <div className="group">
                  <InputField
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 group-hover:border-orange-400"
                    {...registerReset("password")}
                    error={resetErrors?.password?.message}
                  />
                </div>

                <div className="group">
                  <InputField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 group-hover:border-orange-400"
                    {...registerReset("confirmPassword")}
                    error={resetErrors?.confirmPassword?.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                >
                  Reset Password
                </button>

                {/* <div
                  onClick={() => setStep(1)}
                  className="text-center cursor-pointer text-sm text-gray-500 hover:text-pink-500"
                >
                  Back
                </div> */}

              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Remember your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer text-blue-500 hover:text-blue-600 font-semibold"
                >
                  Sign In
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
