import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/* add reaction */
const addReaction = async (req, res) => {
  try {
    const { UserId, PostId, CommentId, ReactionType } = req.body;

    const addedReaction = await prisma.reactions.create({
      data: {
        UserId,
        PostId,
        CommentId,
        ReactionType
      }
    });

    res.status(201).json({
      message: "Post or comment reacted successfully",
      reaction: addedReaction
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* cancel reaction */
const cancelReaction = async (req, res) => {
  try {
    const { id } = req.params;

    const currentReaction = await prisma.reactions.findFirst({ where: { ReactionId: parseInt(id) } });
    
    if(currentReaction.ReactionType === null)
      return res.status(401).json({ error: "Post or comment not reacted" });

    const canceledReaction = await prisma.reactions.update({
      where: { ReactionId: parseInt(id) },
      data: {
        ReactionType: null
      }
    });

    res.status(200).json({
      message: "Reaction canceled successfully",
      reaction: canceledReaction
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* update reaction type */
const updatedReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { ReactionType } = req.body;
  
    const updatedReaction = await prisma.reactions.update({
      where: { ReactionId: parseInt(id) },
      data: {
        ReactionType,
        ReactionDate: new Date()
      }
    });
  
    res.status(200).json({
      message: "Reaction updated successfully",
      reaction: updatedReaction
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}

export {
  addReaction,
  cancelReaction,
  updatedReaction
}