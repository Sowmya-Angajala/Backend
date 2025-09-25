const socket = io("http://localhost:5000");
let username = "";

// Register user
window.registerUser = function () {
  username = document.getElementById("username").value;
  if (!username) return alert("Enter username");

  socket.emit("register", { username, isAdmin: username === "admin" });
};

// Send chat message
window.sendMessage = function () {
  const msg = document.getElementById("message").value;
  if (!msg) return;
  socket.emit("chatMessage", msg);
  document.getElementById("message").value = "";
};

// Disconnect from server
window.disconnect = function () {
  socket.disconnect();
  alert("Disconnected from server");
};

// Receive chat messages
socket.on("chatMessage", (data) => {
  const chatDiv = document.getElementById("chat");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  if (data.isAdmin) msg.style.color = "red";
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// Receive online users list
socket.on("onlineUsers", (users) => {
  const list = document.getElementById("onlineUsers");
  list.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    list.appendChild(li);
  });
});

// Load chat history on connect
socket.on("chatHistory", (messages) => {
  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML = "";
  messages.forEach(data => {
    const msg = document.createElement("p");
    msg.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    if (data.isAdmin) msg.style.color = "red";
    chatDiv.appendChild(msg);
  });
});
