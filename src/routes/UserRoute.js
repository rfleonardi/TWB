import express from 'express';
import upload from '../helpers/Uploader.js';
import authorization from '../middlewares/Authorization.js';
import { registerUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, updateUserProfilePicture, getUserProfilePicture, getUserById, setStatusActive, setStatusInactive, updateUserProfilePictureBase64, searchUsers, getAllFriendsId } from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authorization, getUser);
router.get('/user/:id', authorization, getUserById);
router.get('/users', authorization, getAllUsers);
router.put('/user/update/:id', authorization, updateUser);
router.delete('/user/delete/:id', authorization, deleteUser);
// router.put('/user/update/picture/:id', authorization, upload.single('Image'), updateUserProfilePicture);
router.put('/user/update/picture/:id', authorization, updateUserProfilePictureBase64);
router.get('/user/picture/:id', authorization, getUserProfilePicture);
router.put('/user/status/active', authorization, setStatusActive);
router.put('/user/status/inactive', authorization, setStatusInactive);
router.post('/user/search', authorization, searchUsers);
router.get('/user/friends/:id', authorization, getAllFriendsId);

export default router;
