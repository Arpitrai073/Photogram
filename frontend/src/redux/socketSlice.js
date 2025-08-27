import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:"socketio",
    initialState:{
        isConnected: false,
        socketId: null
    },
    reducers:{
        // actions
        setSocketConnected:(state,action) => {
            state.isConnected = action.payload;
        },
        setSocketId:(state,action) => {
            state.socketId = action.payload;
        }
    }
});
export const {setSocketConnected, setSocketId} = socketSlice.actions;
export default socketSlice.reducer;