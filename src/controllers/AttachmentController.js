import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const sentAttachment = async (req, res) => {
  try {
    const { AttachmentType, MessageId } = req.body;

  const addedAttachment = await prisma.attachments.create({
    data: {
      AttachmentType,
      AttachmentPath: req.file.filename,
      MessageId: parseInt(MessageId)
    }
  });

  res.status(201).json({
    message: "Attachment sent successfully",
    attachment: addedAttachment
  });
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.attachments.delete({ where: { AttachemntId: parseInt(id) } });

    res.status(200).json("Attachment deleted successfully");
  } catch(error) {
    res.status(500).json({ error: error });
  }
}

export {
  sentAttachment,
  deleteAttachment
}