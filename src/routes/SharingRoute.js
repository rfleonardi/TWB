import express from "express";
import authorization from '../middlewares/Authorization.js';
import { addSharing, updateSharing } from "../controllers/SharingController.js";

const router = express.Router();

router.post('/sharing/add', authorization, addSharing);
router.put('/sharing/update/:id', authorization, updateSharing);

export default router;