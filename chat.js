// EchoChic Cleanup Room Chat Client
// Update BACKEND_URL with your deployed server URL

const BACKEND_URL = 'https://your-chat-server.onrender.com'; // <-- UPDATE AFTER DEPLOYING BACKEND

const socket = io(BACKEND_URL);
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

