const Message = require('../models/Message');
const { validationResult } = require('express-validator');
const Notification = require('../models/Notification');

const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content
    });
    await Notification.create({
      userId: receiverId,
      type: 'new_message',
      message: `New message from ${req.user.name}`,
      link: `/messages/${req.user._id}`
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
      .populate('senderId', 'name profilePicture')
      .populate('receiverId', 'name profilePicture')
      .sort({ createdAt: -1 });
    const conversationMap = {};
    messages.forEach(msg => {
      const otherId = msg.senderId._id.toString() === req.user._id.toString()
        ? msg.receiverId._id.toString()
        : msg.senderId._id.toString();
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = msg;
      }
    });
    res.json(Object.values(conversationMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getMyConversations, markAsRead };