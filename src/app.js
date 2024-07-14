import express from 'express';
import UserRoute from './routes/UserRoute.js';
import PostRoute from './routes/PostRoute.js';
import FriendshipRoute from './routes/FriendshipRoute.js';
import ReactionRoute from './routes/ReactionRoute.js';
import CommentRoute from './routes/CommentRoute.js';
import SharingRoute from './routes/SharingRoute.js';
import MessageRoute from './routes/MessageRoute.js';
import AttachmentRoute from './routes/AttachmentRoute.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(UserRoute, PostRoute, FriendshipRoute, ReactionRoute, CommentRoute, SharingRoute, MessageRoute, AttachmentRoute);

export default app;
