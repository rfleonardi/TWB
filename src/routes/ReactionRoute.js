import express from 'express';
import authorization from '../middlewares/Authorization.js';
import { addReaction, cancelReaction, updatedReaction } from '../controllers/ReactionController.js';

const router = express.Router();

router.post('/reaction/add', authorization, addReaction);
router.put('/reaction/cancel/:id', authorization, cancelReaction);
router.put('/reaction/update/:id', authorization, updatedReaction);

export default router;