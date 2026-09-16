/* =========================================================
   AI CHATBOT — Local KB First, OpenAI Fallback
   ---------------------------------------------------------
   • Step 1: Check local FALLBACK_KB for keyword match → instant reply
   • Step 2: If no match → call /api/chat (server.js → OpenAI)
   • Step 3: If OpenAI fails → generic polite fallback message
   ========================================================= */

(function() {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose  = document.getElementById('chatClose');
  const chatBody   = document.getElementById('chatBody');
  const chatInput  = document.getElementById('chatInput');
  const chatSend   = document.getElementById('chatSend');

  const API_ENDPOINT = '/api/chat';

  // ---------- SYSTEM PROMPT ----------
  const SYSTEM_PROMPT = `You are the AI assistant on Jahangir Alam's personal portfolio website.
Your job is to help visitors learn about Jahangir and encourage them to hire him.

About Jahangir Alam:
- Multi-skilled developer, designer, and AI specialist.
- Core skills: Excel Expert, Web Designer, App Maker, AI Master, AI Automator.
- Excel Expert: automated spreadsheets, dashboards, VBA, Power Query, data analyzers.
- Web Designer: HTML, CSS, JS, React, Tailwind, futuristic/glassmorphism aesthetics.
- App Maker: Flutter, Firebase, cross-platform mobile apps, e-commerce UIs.
- AI Master: Python, GPT, NLP, custom AI solutions, chatbots.
- AI Automator: automation pipelines, cloud file sync, automated reporting.
- Contact: jahangirhsstudent@gmail.com
- GitHub: github.com/jahangircoder
- Instagram: @__jahi__ngir359
- Currently AVAILABLE for freelance and full-time opportunities.

Rules:
- Keep replies short, friendly, and helpful (2–4 sentences max).
- If the user asks about hiring, pricing, or projects, direct them to the contact form or email above.
- If you don't know something specific, politely suggest emailing Jahangir.
- Never invent fake project details or fake credentials.
- Be warm, professional, and a little futuristic in tone.`;

  const conversation = [{ role: 'system', content: SYSTEM_PROMPT }];

  // ---------- LOCAL KNOWLEDGE BASE (checked FIRST) ----------
  const LOCAL_KB = [
    { keywords: ['skill', 'skills', 'expert', 'good at', 'specialize', 'speciality'],
      reply: "Jahangir is skilled in: Excel Automation, Web Design, App Development, AI Engineering, and AI Automation. Which one would you like to know more about?" },

    { keywords: ['excel', 'spreadsheet', 'data'],
      reply: "As an Excel Expert, Jahangir builds automated spreadsheets, data analyzers, and dashboards using VBA and Power Query." },

    { keywords: ['web', 'website', 'design', 'frontend', 'ui'],
      reply: "As a Web Designer, Jahangir creates modern, futuristic websites using HTML, CSS, JavaScript, React, and Tailwind — often with neon/glassmorphism aesthetics." },

    { keywords: ['app', 'mobile', 'android', 'ios', 'flutter'],
      reply: "Jahangir builds sleek mobile apps with Flutter and Firebase, including e-commerce UIs and cross-platform utilities,PHONE NUMBER IS 7086487584 DIAL  ON THIS NUMBER." },

    { keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'gpt'],
      reply: "As an AI Master, Jahangir works with Python, GPT models, NLP, and custom AI solutions — including AI chatbots and intelligent dashboards." },

    { keywords: ['automation', 'automate', 'automator', 'workflow'],
      reply: "Jahangir builds automation pipelines that save hours of manual work — from cloud file sync to automated reporting and AI-driven workflows." },

    { keywords: ['project', 'portfolio', 'work', 'built'],
      reply: "Jahangir has built: AI Automation Dashboards, E-commerce App UIs, Excel Data Analyzers, AI Chatbots, Cloud File Automators, and Portfolio Generators. Scroll up to see them!" },

    { keywords: ['hire', 'contact', 'email', 'reach', 'message', 'talk'],
      reply: "You can hire Jahangir by filling out the contact form on this page, or email him directly at jahangirhsstudent@gmail.com. He usually replies within 24 hours!" },

    { keywords: ['price', 'cost', 'rate', 'charge', 'budget', 'fee'],
      reply: "Pricing depends on project scope. Jahangir offers competitive rates for web design, app development, AI automation, and Excel solutions. Send him a message with your project details!" },

    { keywords: ['github', 'code', 'repository'],
      reply: "Check out Jahangir's GitHub at github.com/jahangircoder for open-source projects and code samples." },

    { keywords: ['instagram', 'social'],
      reply: "You can follow Jahangir on Instagram: @__jahi__ngir359" },

    { keywords: ['experience', 'years', 'background'],
      reply: "Jahangir has years of hands-on experience across Excel automation, full-stack web dev, mobile apps, and AI development." },

    { keywords: ['hello', 'hi', 'hey', 'greetings', 'salam', 'assalam'],
      reply: "Hello! 👋 How can I help you today? You can ask about Jahangir's skills, projects, or how to get in touch." },

    { keywords: ['thanks', 'thank', 'appreciate', 'shukriya'],
      reply: "You're welcome! 😊 Feel free to reach out if you have more questions." },

    { keywords: ['who', 'about', 'yourself', 'jahangir'],
      reply: "Jahangir Alam is a multi-skilled developer, designer, and AI specialist who blends creativity with technology to build futuristic digital solutions." },

    { keywords: ['available', 'availability', 'free', 'busy'],
      reply: "Jahangir is currently available for freelance projects and full-time opportunities. Reach out via the contact form!" },

    { keywords: ['chatbot', 'bot', 'you', 'who are you'],
      reply: "I'm Jahangir's AI assistant! Ask me about his skills, projects, or how to reach him." },

    { keywords: ['bye', 'goodbye', 'see you'],
      reply: "Goodbye! 👋 Feel free to come back anytime or email jahangirhsstudent@gmail.com." }
  ];

  // Generic reply if OpenAI also fails
  const GENERIC_FALLBACK = "That's a great question! For specifics, email Jahangir directly at jahangirhsstudent@gmail.com — he replies within 24 hours.";

  // ---------- LOCAL MATCH ----------
  function findLocalReply(userMessage) {
    const msg = userMessage.toLowerCase();
    for (const item of LOCAL_KB) {
      for (const keyword of item.keywords) {
        // word-boundary-ish check for short keywords to avoid false matches
        if (keyword.length <= 3) {
          const regex = new RegExp(`\\b${keyword}\\b`, 'i');
          if (regex.test(msg)) return item.reply;
        } else if (msg.includes(keyword)) {
          return item.reply;
        }
      }
    }
    return null;
  }

  // ---------- UI TOGGLES ----------
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });
  chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

  // ---------- HELPERS ----------
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function addTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.id = 'typingIndicator';
    typing.textContent = 'typing...';
    typing.style.fontStyle = 'italic';
    typing.style.opacity = '0.6';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  async function fetchWithTimeout(url, options, timeoutMs = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // ---------- SEND MESSAGE ----------
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    // ⚡ STEP 1: Try local KB first (instant, free)
    const localReply = findLocalReply(text);

    if (localReply) {
      // Small fake delay for a natural feel
      addTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(localReply, 'bot');
      }, 350);
      return;
    }

    // 🤖 STEP 2: No local match → ask OpenAI
    conversation.push({ role: 'user', content: text });
    addTypingIndicator();

    let reply = null;

    try {
      const response = await fetchWithTimeout(
        API_ENDPOINT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversation })
        },
        12000
      );

      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.reply === 'string' && data.reply.trim()) {
          reply = data.reply.trim();
        }
      }
    } catch (err) {
      console.warn('OpenAI unavailable:', err);
    }

    // 🛟 STEP 3: If OpenAI failed → generic polite reply
    if (!reply) {
      reply = GENERIC_FALLBACK;
    }

    removeTypingIndicator();
    addMessage(reply, 'bot');
    conversation.push({ role: 'assistant', content: reply });

    if (conversation.length > 20) {
      conversation.splice(1, 2);
    }
  }

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSend();
  });
})();