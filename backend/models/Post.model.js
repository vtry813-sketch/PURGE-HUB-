import mongoose, { mongo } from "mongoose";



const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required:true
    },
    mediatype: {
        type: String,
        enum: ['image', 'video'],
        required:true
    },
    media: {
        type: String,
        required:true
    },
    Caption: {
        type:String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref :"User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)

export default Post;