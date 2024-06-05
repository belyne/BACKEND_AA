const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');


const app = express();

const PORT = 2000;

app.use(express.json())

app.get('/api/users', userController.getAllUsers);
app.post('/api/users', userController.createUser);

const db_connect = async () => {
  await mongoose.connect('mongodb://localhost:27017/new_db');
  console.log('connectioon to Database');
}

db_connect();

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});