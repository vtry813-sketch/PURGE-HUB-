import uploadoncloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.model.js";
import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import { getSocketId, io } from "../Socket.js";
export const uploadpost = async (req, res) => {
  try {
    const { caption, mediatype } = req.body;
    let media;
    if (req.file) {
      media = await uploadoncloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" });
    }
    const post = await Post.create({
      caption,
      media,
      mediatype,
      author: req.userId,
    });
    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();
    const populatepost = await Post.findById(post._id).populate(
      "author",
      "name username profileImage"
    );
    return res.status(200).json(populatepost);
  } catch (error) {
    return res.status(500).json({ message: `upload poast error${error}` });
  }
};

export const getallposts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author", "name username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: `getall post error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const postid = req.params.postId;

    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    const alreadyliked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyliked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
      if (post.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author._id,
          type: "like",
          post: post._id,
          message: "Liked Your Post",
        });
        const populatenotification = await Notification.findById(
          notification._id
        ).populate("sender receiver post");
        const receiversocketid = getSocketId(post.author._id);
        if (receiversocketid) {
          io.to(receiversocketid).emit("newnotification", populatenotification);
        }
      }
    }

    await post.save();

    await post.populate([
      { path: "author", select: "name username profileImage" },
      { path: "comments.author", select: "name username profileImage" },
    ]);

    io.emit("likedpost", {
      postId: post._id,
      likes: post.likes,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `likepost error ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postid = req.params.postId;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    post.comments.push({
      author: req.userId,
      message,
    });
    if (post.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: post.author._id,
        type: "comment",
        post: post._id,
        message: "Commented On Your Post",
      });
      const populatenotification = await Notification.findById(
        notification._id
      ).populate("sender receiver post");
      const receiversocketid = getSocketId(post.author._id);
      if (receiversocketid) {
        io.to(receiversocketid).emit("newnotification", populatenotification);
      }
    }
    await post.save();
    await post.populate("author", "name username profileImage"),
      await post.populate("comments.author", "name username profileImage");
    io.emit("comment", {
      postId: post._id,
      comments: post.comments,
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `post comments error${error}` });
  }
};

export const savedpost = async (req, res) => {
  try {
    const postid = req.params.postId;
    const user = await User.findById(req.userId);

    const alreadysaved = user.savedpost.some(
      (id) => id.toString() === postid.toString()
    );

    if (alreadysaved) {
      user.savedpost = user.savedpost.filter(
        (id) => id.toString() !== postid.toString()
      );
    } else {
      user.savedpost.push(postid);
    }
    await user.save();
    user.populate("savedpost");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `saved post  error${error}` });
  }
};

export const postdelete = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    // 🔹 remove post from all users' saved posts
    await User.updateMany(
      { savedpost: postId },
      { $pull: { savedpost: postId } }
    );

    // 🔹 optionally remove related notifications
    await Notification.deleteMany({ post: postId });

    // 🔹 delete the post itself
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `post delete error ${error}` });
  }
};
