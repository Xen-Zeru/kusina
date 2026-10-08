const { generateResponse } = require('../services/chatService');

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // history is optional ([{ role: 'user'|'model', text: '...' }]);
    // missing/empty history behaves as a single-turn request.
    const reply = await generateResponse(message, history);
    res.json({ reply });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { handleChat };
