# 🍽️ Dishes CRUD API (Express.js + File-based Storage)

This is a simple RESTful API built with **Express.js** to manage a list of dishes.  
The data is stored in a local JSON file (`db.json`) — no database required.

---

## 📁 Project Structure

/project-folder
│
├── server.js # Main Express server
├── db.json # File-based database
├── package.json # npm config
└── README.md # Project documentation

## 🚀 Features

Add a new dish  
Retrieve all dishes  
Retrieve dish by ID  
Update dish by ID  
 Delete dish by ID  
 Search dishes by name via query param  

 ---

## 🛠️ Setup Instructions

### 1. Initialize the Project
```bash 
npm init -y

npm install express
 
node server.js //run the server
