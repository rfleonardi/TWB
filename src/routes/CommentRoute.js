import express from "express";
import authorization from '../middlewares/Authorization.js';
import { addComment, deleteComment, updateComment } from "../controllers/CommentController.js";

const router = express.Router();

router.post('/comment/add', authorization, addComment);
router.put('/comment/update/:id', authorization, updateComment);
router.delete('/comment/delete/:id', authorization, deleteComment);

export default router;