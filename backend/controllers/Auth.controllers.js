import genToken from "../config/Token.js"
import User from "../models/User.model.js"
import bcrypt from 'bcryptjs'

export const signUp = async (req, res) => {
    try {
        const{name,email,password,username}=req.body
        const findbyemail = await User.findOne({ email })
        if (findbyemail) {
            return res.status(400).json({message:"Email Already exist!!"})
        }
        const findbyusername = await User.findOne({ username })
        if (findbyusername) {
            return res.status(400).json({message:"Username Already Exist!"})
        }

        if (password.length < 8) {
            return res.status(400).json({message:"Password must be at least 8 characters long!"})
        }

        const hashpassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            username,
            email,
            password :hashpassword
        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite:"Strict"
        })
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`signup error ${error}`})
    }
}




export const signIn = async (req, res) => {
    try {
        const { password, username } = req.body
        
        const user = await User.find({ username })
        if (!user) {
            return res.status(400).json({message:"user not find !"})
        }
        
        const ismatched=bcrypt.compare(password,user.password)
        if (!ismatched) {
            return res.status(400).json({message:"Incorrect Password !"})
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite:"Strict"
        })
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`signin error ${error}`})
    }
}


export const signOut = async (req ,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"signOut successfully !"})
    } catch (error) {
        return res.status(500).json({message:`signOut Error ${error}`})
    }
}