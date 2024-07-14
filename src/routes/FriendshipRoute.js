import express from "express"
import authorization from '../middlewares/Authorization.js';
import { acceptFriendshipRequest, declineFriendshipRequest, getOtherUsers, removeFriendship, sendFriendshipRequest } from "../controllers/FriendshipController.js";

const router = express.Router();

router.post('/friendship/add/:id?', authorization, sendFriendshipRequest);
router.put('/friendship/accept/:id', authorization, acceptFriendshipRequest);
router.put('/friendship/decline/:id', authorization, declineFriendshipRequest);
router.put('/friendship/remove/:id', authorization, removeFriendship);
router.get('/friendship/other/:id', authorization, getOtherUsers);

export default router;