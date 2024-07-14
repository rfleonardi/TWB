import { PrismaClient } from '@prisma/client';
import { getAllFriendsIdFunction } from './UserController.js';
import saveBase64File from '../helpers/Base64Uploader.js';

const prisma = new PrismaClient();


/* Create a post */
const addPost = async (req, res) => {
  try {
    const { UserId, PostText, PostType } = req.body;

    const createdPost = await prisma.posts.create({
      data: {
        UserId: parseInt(UserId),
        PostText,
        PostType,
        PostContent: req.file.filename
      }
    });

    res.status(201).json({
      message: "Post created successfully",
      post: createdPost
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Create a post using base 64 */
const addPostBase64 = async (req, res) => {
    try {
      const { UserId, PostText, PostType, Base64ImageData } = req.body;
      const filename = saveBase64File(Base64ImageData);

      const createdPost = await prisma.posts.create({
        data: {
          UserId: parseInt(UserId),
          PostText,
          PostType,
          PostContent: filename
        }
      });

      res.status(201).json({
        message: "Post created successfully",
        post: createdPost
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}


/* Update a post's text */
const updatePost = async (req, res) => {
  try {
    const { PostText } = req.body;
    const { id } = req.params;

    const updatedPost = await prisma.posts.update({
      where: { PostId: parseInt(id) },
      data: { PostText }
    });

    res.status(200).json({
      message: "Post edited successfully",
      post: updatedPost
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* delete a post */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.posts.delete({ where: { PostId: parseInt(id) } });
    res.status(200).json("Post deleted successfully");
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* get all posts and all post's comments for one user ===> all posts showed in user profile */
const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await prisma.posts.findMany({
      where: { UserId: parseInt(id) },
      orderBy: {
        PostDate: 'desc'
      },
      include: {
        Comments: true
      }
    });

    res.status(200).json(posts);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Search posts with all comments by PostText ===> search bar */
const searchPosts = async (req, res) => {
  try {
    const { Key } = req.body;

    const posts = await prisma.posts.findMany({
      where: {
        PostText: {
          startsWith: `%${Key}`,
        }
      },
      orderBy: { PostDate: 'desc' },
      include: {
        Comments: true,
        Users: true
      }
    });

    res.status(200).json(posts);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Select all friend posts for one user */
const getFriendPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const friendsId = await getAllFriendsIdFunction(id);
    console.log(friendsId);

    const posts = await prisma.posts.findMany({
      where: {
        UserId: {
          in: friendsId
        }
      },
      orderBy: { PostDate: 'desc' }
    });

    res.status(200).json(posts);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


export {
  addPost,
  addPostBase64,
  updatePost,
  deletePost,
  getUserPosts,
  searchPosts,
  getFriendPosts
}