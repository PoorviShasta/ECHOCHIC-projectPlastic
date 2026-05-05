// EchoChic Cleanup Room Chat Client
// Update BACKEND_URL with your deployed server URL

// Static Demo Mode for Netlify - No Backend Required
const MOCK_MESSAGES = [
  { username: 'Volunteer Lead', message: 'Great cleanup last weekend! 🌟 Collected 50kg plastic!', timestamp: '2 days ago' },
  { username: 'Team Member', message: 'Ready for beach cleanup Saturday? Bring gloves!', timestamp: 'Today' },
  { username: 'New Volunteer', message: 'First time joining - excited to learn upcycling!', timestamp: '1 hour ago' }
];

const messages = document.getElementById('messages');
const status = document.getElementById('chat-status');
const sendBtn = document.getElementById('send');
const input = document.getElementById('message');
const usernameInput = document.getElementById('username');

let username = localStorage.getItem('chatUsername') || 'Volunteer';
if (usernameInput) usernameInput.value = username;

if (usernameInput) {
  usernameInput.addEventListener('change', () => {
    username = usernameInput.value || 'Volunteer';
    localStorage.setItem('chatUsername', username);
  });
}

function addMessage(data) {
  const item = document.createElement('li');
  item.classList.add('message');
  item.innerHTML = `<strong>${data.username}:</strong> <p>${data.message}</p><time>${data.timestamp}</time>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function loadMockMessages() {
  MOCK_MESSAGES.forEach(addMessage);
}

function sendDemoMessage() {
  const msg = input.value.trim();
  if (msg) {
    const demoMsg = {
      username,
      message: msg,
      timestamp: 'Just now'
    };
    addMessage(demoMsg);
    input.value = '';
    status.textContent = `Demo message sent: "${msg}"`;
    setTimeout(() => status.textContent = 'Demo chat - type to add messages', 3000);
  }
}

if (sendBtn && input) {
  sendBtn.addEventListener('click', sendDemoMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendDemoMessage();
  });
}

if (messages) {
  loadMockMessages();
  status.textContent = 'Demo chat loaded - click Send to add messages';
}

// Note: For live chat, deploy backend/server.js and update socket URL
const messages = document.getElementById('messages');
const status = document.getElementById('chat-status');
const sendBtn = document.getElementById('send');
const input = document.getElementById('message');
const usernameInput = document.getElementById('username');

let username = localStorage.getItem('chatUsername') || 'Anonymous';
usernameInput.value = username;

usernameInput.addEventListener('change', () => {
  username = usernameInput.value || 'Anonymous';
  localStorage.setItem('chatUsername', username);
});

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const msg = input.value.trim();
  if (msg) {
    socket.emit('chat message', { username, message: msg });
    input.value = '';
  }
}

socket.on('connect', () => {
  updateStatus('Connected to cleanup room');
});

socket.on('disconnect', () => {
  updateStatus('Disconnected. Reconnecting...');
});

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.classList.add('message');
  item.innerHTML = `<strong>${data.username}:</strong> <p>${data.message}</p><time>${data.timestamp}</time>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user joined', (data) => {
  updateStatus(data.message);
});

socket.on('user left', (data) => {
  updateStatus(data.message);
});

function updateStatus(msg) {
  status.textContent = msg || 'Connected to cleanup room';
}

