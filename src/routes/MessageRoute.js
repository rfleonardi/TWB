import express from 'express';
import authorization from '../middlewares/Authorization.js';
import { addMessage, deleteMessage, message, messagesBetweenUser } from '../controllers/MessageController.js';

const router = express.Router();

router.post('/message/add', authorization, addMessage);
router.delete('/message/delete/:id', authorization, deleteMessage);
router.get('/message/exemple', authorization, messagesBetweenUser);
router.get('/message/:id', authorization, message);

export default router;