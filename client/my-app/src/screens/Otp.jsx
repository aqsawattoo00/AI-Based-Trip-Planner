import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyOtp, useReSendOtp } from "../hooks/hooks";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync } = useVerifyOtp();
  const { mutateAsync: resendOtpAsync } = useReSendOtp();

  const OTP_LENGTH = 6;

  const [input, setInput] = useState(Array(OTP_LENGTH).fill(""));

  const refData = Array.from({ length: OTP_LENGTH }, () => useRef());

  useEffect(() => {
    refData[0].current?.focus();
  }, []);

  const fromPage = location?.state?.from || "";

  const getUserInput = (e, index) => {
    const value = e.target.value;

    // Only allow one digit
    if (!/^\d?$/.test(value)) return;

    const copy = [...input];
    copy[index] = value;
    setInput(copy);

    if (value && index < OTP_LENGTH - 1) {
      refData[index + 1].current?.focus();
    }
  };

  const setBackKey = (e, index) => {
    if (e.key === "Backspace") {
      const copy = [...input];

      if (copy[index] !== "") {
        copy[index] = "";
        setInput(copy);
      } else if (index > 0) {
        refData[index - 1].current?.focus();
      }
    }
  };

  const pastOtp = (e) => {
    e.preventDefault();

    const pastedText = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const otpArray = Array(OTP_LENGTH).fill("");

    pastedText.split("").forEach((digit, index) => {
      otpArray[index] = digit;
    });

    setInput(otpArray);

    const focusIndex =
      pastedText.length === OTP_LENGTH
        ? OTP_LENGTH - 1
        : pastedText.length;

    refData[Math.min(focusIndex, OTP_LENGTH - 1)].current?.focus();
  };

  const sendOtp = async () => {
    const otp = input.join("");

    if (otp.length !== OTP_LENGTH) {
      alert("Please enter a valid OTP");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("UserId not found. Please register again.");
      navigate("/register");
      return;
    }

    try {
      const result = await mutateAsync({ userId, otp });

      if (result?.ok) {
        if (fromPage === "forgot-password") {
          navigate("/forgot-password", {
            state: { from: "otp" },
          });
          return;
        }

        navigate("/");
      } else {
        alert(result?.message || "OTP is not correct");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const resendOtp = async () => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (!userId || !email) {
      alert("User information not found.");
      return;
    }

    try {
      await resendOtpAsync({ userId, email });
      alert("OTP has been sent again.");
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              OTP Verification
            </h1>

            <p className="text-blue-100 mt-2">
              Enter the verification code sent to your device
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-10">
            <label className="block text-gray-700 text-sm font-medium mb-4 text-center">
              6-Digit Verification Code
            </label>

            <div className="flex justify-center space-x-3">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={refData[index]}
                  maxLength={1}
                  value={input[index]}
                  onChange={(e) => getUserInput(e, index)}
                  onKeyDown={(e) => setBackKey(e, index)}
                  onPaste={pastOtp}
                  className="w-16 h-16 text-4xl font-bold text-center text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 shadow-sm"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={sendOtp}
              className="w-full cursor-pointer py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Verify & Continue
            </button>

            <div className="flex justify-center">
              <button
                onClick={resendOtp}
                className="text-gray-600 hover:text-blue-600 font-medium text-sm cursor-pointer hover:underline flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <span>Resend OTP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate ,useLocation} from "react-router-dom";
// import { useVerifyOtp, useReSendOtp } from "../hooks/hooks";  



// function Otp() {
//   const navigate = useNavigate();
//   const { mutateAsync } = useVerifyOtp();
//   const { mutateAsync: resendOtpAsync } = useReSendOtp();
//   const location = useLocation()
//   const string = ["", "", "", "", "", ""];
//   const refData = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

//   const [input, setInput] = useState(string);

//   useEffect(() => {
//     refData[0].current.focus();
//   }, []);

//   const fromPage = location?.state?.from || ''


//   const getUserInput = (e, index) => {
//     const value = e.target.value;
//     const regularExpression = /^[0-9]/;
//     const regularExpressionResult = regularExpression.test(value);

//     if (!regularExpressionResult) {
//       return null;
//     }
//     const inputCopy = [...input];
//     inputCopy[index] = value;
//     setInput(inputCopy);

//     const stringLength = string.length - 1;

//     if (index < stringLength) {
//       refData[index + 1].current.focus();
//     }
//   };

//   const setBackKey = (e, index) => {
//     const keyCodeIs = e.keyCode;

//     if (keyCodeIs === 8) {
//       const copyString = [...input];
//       copyString[index] = "";
//       setInput(copyString);
//       if (index > 0) {
//         refData[index - 1].current.focus();
//       }
//     }
//   };

//   const pastOtp = (e) => {
//     const paste = e.clipboardData.getData("text");
//     const getCorrectPastData = paste.slice(0, 6).split("");
//     setInput(getCorrectPastData);
//     if (getCorrectPastData.length == input.length) {
//       refData[5].current.focus();
//     }
//   };

//   const sendOtp = async () => {
//     const otp = input.join("");
//     if (otp.length !== 6) {
//       alert("Please enter a valid OTP");
//       return;
//     }
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("UserId not found. Please register again.");
//       navigate("/register");
//       return;
//     }

//     const result = await mutateAsync({ userId, otp });
//     if (result?.ok) {
//       // alert(result?.message || "Otp verified successfully");
//       if(fromPage === "forgot-password"){
//         navigate("/forgot-password", { state: { from: "otp" } });
//         return;
//       }
//       navigate("/");
//       return;
//     }
//     alert(result?.message || "Otp is not correct");
//   };

//   const resendOtp = ()=>{
//     const email = localStorage.getItem('email')
//     const userId = localStorage.getItem("userId")
//      if(userId &&email){
//       resendOtpAsync({userId,email})
//     }





//   }



//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
//       <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
//          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-white">OTP Verification</h1>
//             <p className="text-blue-100 mt-2">
//               Enter the verification code sent to your device
//             </p>
//           </div>
//         </div>

//         <div className="p-8">
//            <div className="mb-10">
//             <label className="block text-gray-700 text-sm font-medium mb-4 text-center">
//               6-Digit Verification Code
//             </label>
//             <div className="flex justify-center space-x-3">
//               {input.map((item, index) => (
//                 <div key={index} className="relative">
//                   <input
//                     type="text"
//                     ref={refData[index]}
//                     maxLength={1}
//                     value={input[index]}
//                     onChange={(e) => getUserInput(e, index)}
//                     onKeyDown={(e) => setBackKey(e, index)}
//                     onPaste={(e) => pastOtp(e, index)}
//                     className="w-16 h-16 text-4xl font-bold text-center text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 shadow-sm"
//                   />
//                   {/* {index < input.length - 1 && (
//                     <div className="absolute top-1/2 right-0 translate-x-2 w-1 h-1 bg-gray-300 rounded-full"></div>
//                   )} */}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <button
//               onClick={sendOtp}
//               className="w-full cursor-pointer py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
//             >
//               Verify & Continue
//             </button>

//             <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0  ">
//               <button onClick={resendOtp} className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center space-x-1  cursor-pointer hover:underline">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//                 <span>Resend OTP</span>
//               </button>


//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Otp;

