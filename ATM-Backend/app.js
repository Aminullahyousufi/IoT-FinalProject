const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const cors = require('cors'); 
const app = express();
app.use(express.json());
app.use(cors());

const mongoURL = 'mongodb+srv://Osma:1234@cluster0.9ph89dx.mongodb.net/';


const client = new MongoClient(mongoURL, { useUnifiedTopology: true });

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Bank');
    const collection = db.collection('Users');

    app.post('/Users/login', async (req, res) => {
      const { username, password } = req.body;
      const user = await collection.findOne({ username, password });

      if (user) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    });
  

    
app.get('/Users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await collection.findOne({ username: username });

    if (result) {
      res.json(result);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Users/deposit', async (req, res) => {
  try {
    const { username, depositAmount } = req.body;
    const user = await collection.findOne({ username: username });
   
    if (user) {
      const currentBalance = user.balance;
      const updatedBalance = currentBalance + depositAmount;

      await collection.updateOne({ username: username }, { $set: { balance: updatedBalance } });

      res.json({ success: true, message: 'Deposit successful' });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Users/withdraw', async (req, res) => {
  try {
    const { username, withdrawAmount } = req.body;
    console.log(withdrawAmount)
    const user = await collection.findOne({ username: username });
    if (user) {
      const currentBalance = user.balance;
      const updatedBalance = currentBalance - withdrawAmount;

      await collection.updateOne({ username: username }, { $set: { balance: updatedBalance } });

      res.json({ success: true, message: 'Deposit successful' });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Users/transfer', async (req, res) => {
  try {
    const { senderUsername, recipientEmail, transferAmount } = req.body;

    
    const sender = await collection.findOne({ username: senderUsername });
    const recipient = await collection.findOne({ eamil: recipientEmail });

    if (!sender || !recipient) {
      return res.status(404).send('User not found');
    }

    
    if (sender.balance < transferAmount) {
      return res.status(400).send('Insufficient balance for transfer');
    }

    
    const updatedSenderBalance = sender.balance - transferAmount;
    const updatedRecipientBalance = recipient.balance + transferAmount;

    await collection.updateOne({ username: senderUsername }, { $set: { balance: updatedSenderBalance } });
    await collection.updateOne({ eamil: recipientEmail }, { $set: { balance: updatedRecipientBalance } });

    res.json({ success: true, message: 'Transfer successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();