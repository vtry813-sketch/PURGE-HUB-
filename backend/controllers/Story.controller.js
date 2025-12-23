import User from '../models/User.model.js'
import Story from '../models/Story.model.js'
import uploadoncloudinary from '../config/cloudinary.js'
export const uploadstory = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.story) {
            await Story.findByIdAndDelete(user.story)
            user.story = null

        }
        const { mediatype } = req.body
        let media;
        if (req.file) {
            media = await uploadoncloudinary(req.file.path)

        }
        else {
            return res.status(400).json({message:"media is required"})
        }
        const story = await Story.create({
            author:req.userId,mediatype,media
        })
        user.story = story._id
        await user.save()
        const populatedstory = await Story.findById(story._id).populate("author", "name username profileImage").populate("viewers", "name username profileImage")
        return res.status(200).json(populatedstory)
    } catch (error) {
        res.status(500).json({message:"upload story error"})
    }
}


export const Viewstory = async (req, res) => {
    try {
        const storyid = req.params.storyId
        const story = await Story.findById(storyid)
        if (!story) {
            return res.status(400).json({message:"story found"})
        }
        const viewersid = story.viewers.map(id => id.toString())
        if (!viewersid.includes(req.userId.toString())) {
            story.viewers.push(req.userId)
            await story.save()
        }

        const populatestory = await Story.findById(story._id).populate("author", "name username profileImage").populate("viewers", "name username profileImage")
        return res.status(200).json(populatestory)
    } catch (error) {
        return res.status(500).json({message:"view story error"})
    }
}

export const getstorybyusername = async (req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({message:"user not found"})
        }

        const story = await Story.find({
            author:user._id
        }).populate("viewers author")
        return res.status(200).json(story)
    } catch (error) {
        return res.status(500).json({message:"get story error"})
    }
}

export const deletestory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId)
        if(!story){
            return res.status(400).json({message:"no stpry found"})
        }
        await Story.findByIdAndDelete(req.params.storyId)
        await User.updateOne(
            { story: req.params.storyId },
            {$set:{story:null}}
        )
        res.json({message:"story delete"})
    } catch (error) {
        return res.status(500).json({message:"story delete error"})
    }
}


export const getallstory = async (req, res) => {
    try {
        const currentuser = await User.findById(req.userId)
        const followingid = currentuser.following
        const stories = await Story.find({
            author:{$in:followingid}
        }).populate("author viewers").sort({ createdAt: -1 })
        return res.status(200).json(stories)
    } catch (error) {
        return res.status(500).json({message:"get all story error"})
    }
}