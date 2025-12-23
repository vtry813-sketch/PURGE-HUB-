import mongoose, { mongo } from "mongoose";
import User from './User.model.js'
const storySchema = new mongoose.Schema({
     author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required:true
    },
    mediatype: {
        type: String,
        enum: ["image", "video"],
        required:true
        
    },
    media: {
        type: String,
        required:true
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
       
    },

}, { timestamps: true })
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
const Story = mongoose.model("Story", storySchema)

export default Story;