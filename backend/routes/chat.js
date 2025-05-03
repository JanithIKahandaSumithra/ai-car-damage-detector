// routes/chat.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all chats for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let query;
    if (userType === 'customer') {
      query = `
        SELECT c.*, g.garage_name, g.address 
        FROM chats c
        JOIN garages g ON c.garage_id = g.id
        WHERE c.customer_id = ?
        ORDER BY c.created_at DESC
      `;
    } else {
      query = `
        SELECT c.*, u.username as customer_name 
        FROM chats c
        JOIN users u ON c.customer_id = u.id
        JOIN garages g ON c.garage_id = g.id
        WHERE g.user_id = ?
        ORDER BY c.created_at DESC
      `;
    }

    const [chats] = await db.execute(query, [userId]);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Create new chat
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { garage_id } = req.body;
    const customer_id = req.user.userId;

    // Check if chat already exists
    const [existingChats] = await db.execute(
      'SELECT * FROM chats WHERE customer_id = ? AND garage_id = ?',
      [customer_id, garage_id]
    );

    if (existingChats.length > 0) {
      return res.json(existingChats[0]);
    }

    // Create new chat
    const [result] = await db.execute(
      'INSERT INTO chats (customer_id, garage_id) VALUES (?, ?)',
      [customer_id, garage_id]
    );

    const [newChat] = await db.execute(
      'SELECT c.*, g.garage_name FROM chats c JOIN garages g ON c.garage_id = g.id WHERE c.id = ?',
      [result.insertId]
    );

    res.status(201).json(newChat[0]);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// Get chat messages
router.get('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const [messages] = await db.execute(
      `SELECT m.*, u.username as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.chat_id = ? 
       ORDER BY m.created_at ASC`,
      [req.params.chatId]
    );
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send message
router.post('/:chatId/messages', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const chatId = req.params.chatId;
    const senderId = req.user.userId;

    const [result] = await db.execute(
      'INSERT INTO messages (chat_id, sender_id, message) VALUES (?, ?, ?)',
      [chatId, senderId, message]
    );

    const [newMessage] = await db.execute(
      `SELECT m.*, u.username as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

router.delete('/:chatId', authMiddleware, async (req, res) => {
    try {
      // First check if the user has permission to delete this chat
      const [existingChat] = await db.execute(
        `SELECT * FROM chats WHERE id = ? AND 
        (customer_id = ? OR garage_id IN (SELECT id FROM garages WHERE user_id = ?))`,
        [req.params.chatId, req.user.userId, req.user.userId]
      );
  
      if (existingChat.length === 0) {
        return res.status(403).json({ message: 'Unauthorized to delete this chat' });
      }
  
      // Delete all messages in the chat first
      await db.execute('DELETE FROM messages WHERE chat_id = ?', [req.params.chatId]);
  
      // Then delete the chat itself
      await db.execute('DELETE FROM chats WHERE id = ?', [req.params.chatId]);
  
      res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ message: 'Error deleting chat' });
    }
  });
  
  // Delete a message
  router.delete('/messages/:messageId', authMiddleware, async (req, res) => {
    try {
      // Check if the user owns this message
      const [existingMessage] = await db.execute(
        'SELECT * FROM messages WHERE id = ? AND sender_id = ?',
        [req.params.messageId, req.user.userId]
      );
  
      if (existingMessage.length === 0) {
        return res.status(403).json({ message: 'Unauthorized to delete this message' });
      }
  
      // Delete the message
      await db.execute('DELETE FROM messages WHERE id = ?', [req.params.messageId]);
  
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Error deleting message' });
    }
  });

module.exports = router;