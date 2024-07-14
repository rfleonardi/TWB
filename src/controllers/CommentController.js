import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/* add comment */
const addComment = async (req, res) => {
  try {
    const { UserId, PostId, CommentContent } = req.body;

    const addedComment = await prisma.comments.create({
      data: {
        UserId,
        PostId,
        CommentContent
      }
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: addedComment
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* update comment */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { CommentContent } = req.body;

    const updatedComment = await prisma.comments.update({
      where: { CommentId: parseInt(id) },
      data: { CommentContent }
    });

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment
    });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* delete comment */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.comments.delete({ where: { CommentId: parseInt(id) } });
    res.status(200).json("Comment deleted successfully");
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


export {
  addComment,
  updateComment,
  deleteComment,
}