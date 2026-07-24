import bcrypt from "bcrypt"

export const makeHashingPassword = async (password)=>{
    const salt = 10;
    return await bcrypt.hash(password,salt)
}

export const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed)
}