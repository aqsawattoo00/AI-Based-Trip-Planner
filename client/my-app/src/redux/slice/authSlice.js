import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:[]
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.user = action.payload
        },
        logout:(state)=>{
            state.user = null
        }
    }
})

export const {addUser, logout} = authSlice.actions
export const userData = (state)=>state.auth.user

export default authSlice.reducer