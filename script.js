const chatbox = document.getElementById('chatbox');
const voiceInput = document.getElementById('voiceInput');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

const OPENAI_API_KEY = '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';  // 🔐 Replace with your real API key

function addChat(role, text) {
  const div = document.createElement('div');
  div.className = role;
  div.textContent = `${role === 'user' ? 'You' : 'Bot'}: ${text}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function chatWithGPT(userInput) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function startListening() {
  recognition.start();
}

recognition.onresult = async (event) => {
  const userText = event.results[0][0].transcript;
  voiceInput.value = userText;
  addChat('user', userText);

  try {
    const gptResponse = await chatWithGPT(userText);
    addChat('bot', gptResponse);
  } catch (err) {
    addChat('bot', 'Error contacting ChatGPT.');
    console.error(err);
  }
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};
