import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/* send a message */
const addMessage = async (req, res) => {
  try {
    const { MessageContent, SenderId, RecipientId } = req.body;

    const addedMessage = await prisma.messages.create({
      data: {
        MessageContent,
        SenderId,
        RecipientId
      }
    });

    res.status(201).json({
      message: "Message sent successfully",
      conversation: addedMessage
    })
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* remove a message */
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.messages.delete({ where : { MessageId: parseInt(id) } });

    res.status(200).json("Message deleted successfully");
  } catch(error) {
    res.status(500).json({ error: error });
  }
}


/* get messages between two users */
const messagesBetweenUser = async (SenderId, RecipientId) => {  
  const messages = await prisma.messages.findMany({
    where: {
      OR: [
        { SenderId: parseInt(SenderId), RecipientId: parseInt(RecipientId) },
        { RecipientId: parseInt(SenderId), SenderId: parseInt(RecipientId) }
      ]
    },
    orderBy: { MessageSendDate: 'desc' }
  });

  return messages;
}


const message = async (req, res) => {
  const { id } = req.params;

  const messages = await prisma.$queryRaw`
    SELECT SenderId, RecipientId FROM Messages WHERE SenderId = ${id} OR RecipientId = ${id} ORDER BY MessageSendDate DESC;
  `;

  const allMessagesUsersId = messages.map(message => {
    if(message.SenderId === parseInt(id))
      return message.RecipientId;
    else
      return message.SenderId;
  });

  const messagesUsersId = [...new Set(allMessagesUsersId)];
  
  const conversations = await Promise.all(messagesUsersId.map( async (RecipientId) => {
    return await messagesBetweenUser(id, RecipientId);
  }));

  console.log(conversations);
  res.status(200).json(conversations);
}


export {
  addMessage,
  deleteMessage,
  messagesBetweenUser,
  message
}