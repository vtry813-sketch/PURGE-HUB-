import uploadoncloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "posts loops posts.author posts.comment loops.author loops.comment story following"
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Get current user error! ${error}` });
  }
};

export const suggestedusers = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.userId);

    const users = await User.aggregate([
      { $match: { _id: { $ne: loggedInUserId } } }, // exclude logged-in user properly
      { $sample: { size: 6 } }, // random 5 users
      { $project: { password: 0 } }, // exclude password field
    ]);

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get suggested user error ${error}` });
  }
};

export const editprofile = async (req, res) => {
  try {
    const { name, username, bio, profession } = req.body;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingUser = await User.findOne({ username }).select("-password");
    if (existingUser && existingUser._id.toString() !== req.userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    let profileImageUrl = user.profileImage;

    if (req.file) {
      const uploaded = await uploadoncloudinary(req.file.path);
      profileImageUrl = uploaded;
    }

    user.name = name;
    user.username = username;
    user.bio = bio;
    user.profession = profession;
    user.profileImage = profileImageUrl;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "edit profile error",
      error: error.message,
    });
  }
};

export const getprofile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select("-password")
      .populate("posts loops followers following");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get profile error ${error}` });
  }
};

// ne is not equal

import { io, getSocketId } from "../Socket.js";

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetuserId;

    if (!targetUserId) {
      return res.status(400).json({ message: "target user not found" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "you cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(400).json({ message: "user not found" });
    }

    // ✅ FIX: ObjectId comparison
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        following: false,
        message: "unfollowed",
      });
    } else {
      // FOLLOW
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      if (currentUserId !== targetUserId) {
        const notification = await Notification.create({
          sender: currentUserId,
          receiver: targetUserId,
          type: "follow",
          message: "Started following you",
        });

        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver");

        const receiverSocketId = getSocketId(targetUserId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newnotification",
            populatedNotification
          );
        }
      }

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        following: true,
        message: "followed",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "follow error" });
  }
};

export const search = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ message: "query must be requird" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `user search error ${error}` });
  }
};

export const followinglist = async (req, res) => {
  try {
    const result = await User.findById(req.userId);
    return res.status(200).json(result.following);
  } catch (error) {
    return res.status(500).json({ message: `user following error ${error}` });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.userId,
    })
      .populate("sender receiver post loop")
      .sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: `get notification error ${error}` });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (Array.isArray(notificationId)) {
      // bulk mark-as-read
      await Notification.updateMany(
        { _id: { $in: notificationId }, receiver: req.userId },
        { $set: { isRead: true } }
      );
    } else {
      // mark single notification as read
      await Notification.findOneAndUpdate(
        { _id: notificationId, receiver: req.userId },
        { $set: { isRead: true } }
      );
    }
    return res.status(200).json({ message: "marked as read" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `read notification error ${error}` });
  }
};
