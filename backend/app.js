// app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => res.send('API is running'));
app.post('/send-test-notification', (req, res) => {
    const io = req.app.get('io');
    console.log('Emitting test notification');
    io.emit('notification', { message: 'This is a test notification' });
    res.status(200).send('Test notification sent');
  });
module.exports = app;  
