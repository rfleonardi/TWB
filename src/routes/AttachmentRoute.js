import express from "express";
import upload from '../helpers/Uploader.js';
import authorization from '../middlewares/Authorization.js';
import { deleteAttachment, sentAttachment } from "../controllers/AttachmentController.js";

const router = express.Router();

router.post('/attachment/add', authorization, upload.single('File'),sentAttachment);
router.delete('/attachment/delete/:id', authorization, deleteAttachment);

export default router;