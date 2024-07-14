import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/* send a friendship request */
const sendFriendshipRequest = async (req, res) => {
  try {
    const { RequesterUserId, RecipientUserId } = req.body;
    const { id } = req.params;

    const recipient = await prisma.friendships.findFirst({ where: { RequesterUserId: parseInt(RecipientUserId), RecipientUserId: parseInt(RequesterUserId) } });

    if(recipient && recipient.FriendshipStatus !== null)
      return res.status(401).json({ error: "These users have already a friendship relation"});
      
    if(!id) {
      const friendshipRequest = await prisma.friendships.create({
        data: {
          RequesterUserId,
          RecipientUserId
        }
      });
  
      res.status(201).json({
        message: "Friendship requested successfully",
        friendship: friendshipRequest
      });
    } else {
      const friendship = await prisma.friendships.findUnique({ where: { FriendshipId: parseInt(id) } });

      if(friendship.FriendshipStatus !== null)
        return res.status(401).json({ error: "These users have already a friendship relation"});
  
      const friendshipRequest = await prisma.friendships.update({
        where: { FriendshipId: parseInt(id) },
        data: { FriendshipStatus: "Pending" }
      });
  
      res.status(200).json({
        message: "Friendship requested successfully",
        friendship: friendshipRequest
      }); 
    }
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* accept a friendship request */
const acceptFriendshipRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const friendship = await prisma.friendships.findUnique({ where: { FriendshipId: parseInt(id) } });

    if(friendship.FriendshipStatus !== 'Pending')
      return res.status(401).json({ error: "Friendship request is not pending"});

    const acceptedFriendshipRequest = await prisma.friendships.update({
      where: { FriendshipId: parseInt(id) },
      data: { FriendshipStatus: "Friend" }
    });

    res.status(200).json({
      message: "Friendship request accepted successfully",
      friendship: acceptedFriendshipRequest
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* decline a friendship request */
const declineFriendshipRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const friendship = await prisma.friendships.findUnique({ where: { FriendshipId: parseInt(id) } });

    if(friendship.FriendshipStatus !== 'Pending')
      return res.status(401).json({ error: "Friendship request is not pending"});

    const declinedFriendshipRequest = await prisma.friendships.update({
      where: { FriendshipId: parseInt(id) },
      data: { FriendshipStatus: null }
    });

    res.status(200).json({
      message: "Friendship request declined successfully",
      friendship: declinedFriendshipRequest
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* remove a friend in friendship list */
const removeFriendship = async (req, res) => {
  try {
    const { id } = req.params;

    const friendship = await prisma.friendships.findUnique({ where: { FriendshipId: parseInt(id) } });

    if(friendship.FriendshipStatus !== 'Friend')
      return res.status(401).json({ error: "These users are not friend"});

    const removedFriendship = await prisma.friendships.update({
      where: { FriendshipId: parseInt(id) },
      data: { FriendshipStatus: null }
    });

    res.status(200).json({
      message: "Friendship request removed successfully",
      friendship: removedFriendship
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* get all other users for friendship suggestion */
const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await prisma.friendships.findMany({
      where: { NOT: { FriendshipStatus: null } },
      select: {
        RequesterUserId: true,
        RecipientUserId: true
      }
    });

    const usersId = users.map(user => {
      if(user.RecipientUserId === parseInt(id))
        return user.RequesterUserId;
      else
        return user.RecipientUserId;
    });

    const otherUsers = await prisma.users.findMany({
      where: {
        AND: [
          { NOT: { UserId: parseInt(id) } },
          { NOT: { UserId: { in: usersId.sort() } } }
        ]
      },
      select: {
        UserId: true,
        Username: true
      }
    });

    res.status(200).json(otherUsers);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}


export {
  sendFriendshipRequest,
  acceptFriendshipRequest,
  declineFriendshipRequest,
  removeFriendship,
  getOtherUsers
}