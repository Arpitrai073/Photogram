import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRouter from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
dotenv.config({});
import { app,server } from './socket/socket.js';
import path from "path";





const PORT=process.env.PORT || 3000;

const __dirname=path.resolve();
console.log(__dirname);



app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin: [process.env.URL, "http://localhost:5173", "http://localhost:3000"], 
    credentials:true,
   
};
app.use(cors(corsOptions));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

// app.use(express.static(path.join(__dirname,"/frontend/dist")));

// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
// })

server.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})