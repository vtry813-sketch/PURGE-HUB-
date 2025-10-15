import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
import authRouter from './routes/Auth.routes.js'
import userRouter from './routes/User.routes.js'
dotenv.config()
const app = express()
const port=process.env.PORT   || 5000

app.use(cors({
    origin: "http://localhost:5173",
    withCredentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use('/api/user',userRouter)






app.listen(port, () => {
    connectDb()
    console.log("server started")
})
