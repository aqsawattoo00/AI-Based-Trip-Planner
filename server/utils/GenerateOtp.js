
export const generateOtp = ()=>{

  let otp = []
  for(let i = 0;i<6;i++){
    otp .push(Math.ceil(Math.random()*9))
  }
  const result =  otp.join('')
  return result
}