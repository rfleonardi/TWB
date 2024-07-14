import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import saveBase64File from '../helpers/Base64Uploader.js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


/* User register */
const registerUser = async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(Password, salt);

    const user = await prisma.users.findUnique({ where: { Email } });

    if(user)
      return res.status(409).json({ error: 'User already exists' });

    const createdUser = await prisma.users.create({
      data: {
        Username,
        Password: hashedPassword,
        Email
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      user: createdUser
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* User login */
const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.users.findUnique({ where: { Email } });

    if(!user)
      return res.status(400).json({ error: "Invalid email" });
    
    const comparePassword = bcryptjs.compareSync(Password, user.Password);

    if(!comparePassword)
      return res.status(400).json({ error: "Invalid password" });
      
    const payload = {
      UserId: user.UserId,
      Username: user.Username,
      Email: user.Email
    }

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: "60d" }, 
      (err, token) => {
        if(err || !token)
          return res.status(401).json({ error: "Token not found" });
        res.status(200).json({
          token: token,
          id: user.UserId
        });
      }
    )
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Get user */
const getUser = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({ where: { UserId: req.user.UserId } });

    if(!user)
      return res.status(404).json({ error: "User not found" });
    
    res.json(user);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}

/* Get user by id */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { UserId: parseInt(id) },
      include: {
        Posts: {
          orderBy: { PostDate: 'desc' },
          include: {
            Comments: {
              orderBy: { CommentDate: 'desc' },
              include: {
                _count: {
                  select: { Reactions: true }
                }
              }
            },
            _count: {
              select: { Reaction: true }
            }
          }
        },
        FriendshipRequestsSent: {
          include: {
            FriendshipRecipient: {
              select: { Username: true }
            }
          }
        },
        FriendshipRequestsReceived: {
          include: {
            FriendshipRequester: {
              select: { Username: true }
            }
          }
        },
        Sharings: {
          orderBy: { SharingDate: 'desc' },
          include: {
            Post: true
          }
        },
        MessagesReceived: true,
        MessagesSent: true
      }
    });
    

    if(!user)
      return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Get all users ===> Friendship Request */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Update information about user */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Username, Password, Email } = req.body;
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(Password, salt);

    const updatedUser = await prisma.users.update({
      where: { UserId: parseInt(id) },
      data: {
        Username,
        Password: hashedPassword,
        Email
      }
    });

    res.status(200).json({
      message: "User edited successfully",
      user: updatedUser
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* delete an user */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.users.delete({ where: { UserId: parseInt(id) } });
    res.status(200).json("User deleted successfully");
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Change the user profile picture */
const updateUserProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await prisma.users.update({
      where: { UserId: parseInt(id) },
      data: {
        ProfilePicture: `${process.env.ENDPOINT}:${process.env.PORT}/uploads/images/${req.file.filename}`,
        Posts: {
          create: {
            PostType: 'Image',
            PostContent: `${process.env.ENDPOINT}:${process.env.PORT}/uploads/images/${req.file.filename}`
          }
        }
      }
    });

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Change user profile picture using base 64 */
const updateUserProfilePictureBase64 = async (req, res) => {
    if (req.params.id && req.body.data) {
      try {
        const base64ImageData = req.body.data;
        const filename = saveBase64File(base64ImageData);
  
        const user = await prisma.users.update({
          where: { UserId: parseInt(req.params.id) },
          data: { ProfilePicture: filename }
        });
  
        res.status(200).json({
          message: "Image updated successfully",
          user: user
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      if (!req.params.id) {
        res.status(400).json({ error: "UserId missing" });
      } else {
        res.status(400).json({ error: "image data or filename missing" });
      }
    }  
}

/* Get the user profile picture path from backend folder */
const getUserProfilePicture = async (req, res) => {
  try {  
    const { id } = req.params;

    const user = await prisma.users.findUnique({ where: { UserId: parseInt(id) } });
    res.json(`${process.env.ENDPOINT}:${process.env.PORT}/uploads/images/${user.ProfilePicture}`);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Update status to active */
const setStatusActive = async (req, res) => {
  try {
    const user = await prisma.users.update({
      where: { UserId: parseInt(req.user.UserId) },
      data: { Status: 'Active' }
    });

    res.status(200).json({
      message: "Status changed to active",
      user: user
    })
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Update status to inactive */
const setStatusInactive = async (req, res) => {
  try {
    const user = await prisma.users.update({
      where: { UserId: parseInt(req.user.UserId) },
      data: { Status: 'Inactive' }
    });

    res.status(200).json({
      message: "Status changed to inactive",
      user: user
    })
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* Search user by username */
const searchUsers = async (req, res) => {
  try {
    const { Key } = req.body;

    const users = await prisma.users.findMany({
      where: {
        Username: {
          startsWith: `%${Key}`,
        }
      }
    });

    res.status(200).json(users);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


const getAllFriendsIdFunction = async (id) => {
  const friendships = await prisma.friendships.findMany({
    where: {
      OR: [
        { RequesterUserId: parseInt(id), FriendshipStatus: 'Friend' },
        { RecipientUserId: parseInt(id), FriendshipStatus: 'Friend' }
      ]
    },
    select: {
      RequesterUserId: true,
      RecipientUserId: true
    }
  });

  const friendsId = friendships.map(friendship => {
    if (friendship.RequesterUserId === parseInt(id))
      return friendship.RecipientUserId;
    else
      return friendship.RequesterUserId;
  });

  return friendsId;
}


/* get all UserId of friends */
const getAllFriendsId = async (req, res) => {
  try {
    const { id } = req.params;
    const friendsId = await getAllFriendsIdFunction(id);

    res.status(200).json(friendsId);
  } catch(error) {
    res.status(500).json({ error: error });
  }
}

export { 
  registerUser, 
  loginUser,
  getUser, 
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserProfilePicture,
  updateUserProfilePictureBase64,
  getUserProfilePicture,
  setStatusActive,
  setStatusInactive,
  searchUsers,
  getAllFriendsId,
  getAllFriendsIdFunction
};
