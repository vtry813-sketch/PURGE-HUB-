import Loop from "../models/Loop.model.js";
import User from "../models/User.model.js";
import uploadoncloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.model.js";
import { getSocketId, io } from "../Socket.js";

export const uploadloop = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadoncloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" });
    }
    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });
    const user = await User.findById(req.userId);
    user.loops.push(loop._id);
    await user.save();
    const populateloop = await Loop.findById(loop._id).populate(
      "author",
      "name username profileImage"
    );
    return res.status(200).json(populateloop);
  } catch (error) {
    return res.status(500).json({ message: `upload loop error${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const loopid = req.params.loopId;
    const loop = await Loop.findById(loopid);
    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }
    const alreadyliked = loop.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyliked) {
      loop.likes = loop.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      loop.likes.push(req.userId);
      if (loop.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: loop.author._id,
          type: "like",
          loop: loop._id,
          message: "Liked Your Loop",
        });
        const populatenotification = await Notification.findById(
          notification._id
        ).populate("sender receiver loop");
        const receiversocketid = getSocketId(loop.author._id);
        if (receiversocketid) {
          io.to(receiversocketid).emit("newnotification", populatenotification);
        }
      }
    }
    await loop.save();
    await loop.populate([
      { path: "author", select: "name username profileImage" },
      { path: "comments.author", select: "name username profileImage" },
    ]);

    io.emit("likedloop", {
      loopId: loop._id,
      likes: loop.likes,
    });
    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `likeloop error${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const loopid = req.params.loopId;
    const loop = await Loop.findById(loopid);
    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }
    loop.comments.push({
      author: req.userId,
      message,
    });
    if (loop.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: loop.author._id,
        type: "comment",
        loop: loop._id,
        message: "Commented On Your Loop",
      });
      const populatenotification = await Notification.findById(
        notification._id
      ).populate("sender receiver loop");
      const receiversocketid = getSocketId(loop.author._id);
      if (receiversocketid) {
        io.to(receiversocketid).emit("newnotification", populatenotification);
      }
    }
    await loop.save();
    await loop.populate("author", "name username profileImage"),
      await loop.populate("comments.author", "name username profileImage");

    io.emit("loopcomment", {
      loopId: loop._id,
      comments: loop.comments,
    });

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `loop comments error${error}` });
  }
};

export const getallloops = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author", "name username profileImage")
      .sort({ createdAt: -1 });
    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json({ message: `getall loops error${error}` });
  }
};

export const loopdelete = async (req, res) => {
  try {
    const loop = await Loop.findById(req.params.loopId);
    if (!loop) {
      return res.status(400).json({ message: "loop not exist" });
    }
    await Loop.findByIdAndDelete(req.params.loopId);
    res.json("loop deleted");
  } catch (error) {
    return res.status(500).json({ message: "loop delete error" });
  }
};

export const savedloop = async (req, res) => {
  try {
    const loopid = req.params.loopId;
    const user = await User.findById(req.userId);

    const alreadysaved = user.savedloop.some(
      (id) => id.toString() === loopid.toString()
    );
    if (alreadysaved) {
      user.savedloop = user.savedloop.filter(
        (id) => id.toString() !== loopid.toString()
      );
    } else {
      user.savedloop.push(loopid);
    }
    await user.save();
    user.populate("savedloop");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "savedloop error" });
  }
};
