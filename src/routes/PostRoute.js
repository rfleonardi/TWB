import express from "express";
import upload from '../helpers/Uploader.js';
import authorization from '../middlewares/Authorization.js';
import { addPost, addPostBase64, deletePost, getFriendPosts, getUserPosts, searchPosts, updatePost } from '../controllers/PostController.js';

const router = express.Router();

// router.post('/post/add', authorization, upload.single('File'), addPost);
router.post('/post/add', authorization, addPostBase64);
router.put('/post/update/:id', authorization, updatePost);
router.delete('/post/delete/:id', authorization, deletePost);
router.get('/post/:id', authorization, getUserPosts);
router.post('/post/search', authorization, searchPosts);
router.get('/post/friends/:id', authorization, getFriendPosts);

export default router;
