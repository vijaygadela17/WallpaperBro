const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/my_database';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Assuming your HTML file is in a 'public' directory

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db();
    const messagesCollection = db.collection('messages');

    // Define route to handle form submission
    app.post('/submit', async (req, res) => {
      try {
        const { email, message } = req.body;
        const newMessage = { email, message };
        await messagesCollection.insertOne(newMessage);
        res.status(201).send('Message saved to database!');
      } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Error saving message');
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));
