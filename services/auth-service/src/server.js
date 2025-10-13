const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the Auth Service! 🔐');
});

app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});