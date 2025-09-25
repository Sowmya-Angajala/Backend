# Real-Time Group Chat App with Admin Messaging

## 🚀 Project Overview

A **real-time group chat application** built with **Node.js, Express, Socket.IO, Redis, and MongoDB**.  
Supports multiple users chatting simultaneously, admin announcements, online users tracking, and persistent chat history. Optional feature includes private chat rooms.

---

## 💻 Features

### Core Features
- **User Registration / Join**  
  Users register with a name. Online users list updates for everyone in real-time. Rejoining users are recognized or added again.

- **Group Chat**  
  All users can send and receive messages in real-time. Messages are stored in Redis for fast retrieval.

- **Admin Messaging**  
  Admin users (username: `admin`) can send broadcast announcements. Admin messages are highlighted in red.

- **Disconnect Handling**  
  Users can manually disconnect using a **Disconnect** button. Offline users are removed from the online list.

- **Registered Users Only**  
  Only registered users can see or participate in the chat.

### Additional Feature
- **Chat History Persistence**  
  Chat messages are stored in Redis and periodically backed up to MongoDB using a cron job. On reconnect, recent chat history is loaded from Redis.

### Optional Bonus
- **Private Rooms**  
  Users can create or join rooms. Only users in the same room can chat with each other.


---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express  
- **Real-Time Communication**: Socket.IO  
- **Cache / Fast Storage**: Redis  
- **Database**: MongoDB  
- **Scheduled Backup**: node-cron  
- **Frontend**: HTML, CSS, JavaScript  

---



