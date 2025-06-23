const chatbox = document.getElementById('chatbox');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

function botResponse(text) {
  if (text.includes('hello')) return 'Hi there!';
  if (text.includes('your name')) return 'I am VoiceBot!';
  if (text.includes('bye')) return 'Goodbye!';
  return "Sorry, I didn't understand that.";
}

function addChat(role, text) {
  const div = document.createElement('div');
  div.className = role;
  div.textContent = `${role === 'user' ? 'You' : 'Bot'}: ${text}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

recognition.onresult = (event) => {
  const userText = event.results[0][0].transcript;
  addChat('user', userText);

  const response = botResponse(userText.toLowerCase());
  addChat('bot', response);

  recognition.start();
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
  recognition.start();
};

window.onload = () => {
  recognition.start();
};
