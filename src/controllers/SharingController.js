import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/* share a post */
const addSharing = async (req, res) => {
  const { UserId, PostId, SharingText } = req.body;

  const addedSharing = await prisma.sharings.create({
    data: {
      UserId,
      PostId,
      SharingText
    }
  });

  res.status(201).json({
    message: "Post shared successfully",
    sharing: addedSharing
  });
}


/* update a sharing text */
const updateSharing = async (req, res) => {
  const { id } = req.params;
  const { SharingText } = req.body;

  const updatedSharing = await prisma.sharings.update({
    where: { SharingId: parseInt(id) },
    data: { SharingText }
  });

  res.status(200).json({
    message: "Sharing post updated successfully",
    sharing: updatedSharing
  });
}


export {
  addSharing,
  updateSharing
}