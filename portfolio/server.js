/* =========================================================
   BACKEND SERVER — Express.js proxy for OpenAI
   ---------------------------------------------------------
   SETUP:
   1) npm init -y
   2) npm install express cors node-fetch dotenv
   3) Create a .env file with:
        OPENAI_API_KEY=sk-your-real-key-here
   4) Run: node server.js
   5) Serve your static files from /public or same directory.

   🔐 Your API key stays HERE on the server — never in the browser.
   ========================================================= */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, style.css, script.js, chatbot.js)
app.use(express.static(__dirname));

// ---------- CHAT ENDPOINT ----------
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server missing OPENAI_API_KEY.' });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',     // fast + cheap. Swap to 'gpt-4o' for higher quality.
        messages: messages,
        temperature: 0.7,
        max_tokens: 220
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error:', errText);
      return res.status(openaiRes.status).json({ error: 'OpenAI request failed.' });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ||
                  "Sorry, I didn't catch that. Could you rephrase?";

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});