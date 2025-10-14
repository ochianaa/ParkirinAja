const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('Hello from the Garage Service! 🔐');
});

app.listen(PORT, () => {
  console.log(`Garage Service is running on port ${PORT}`);
});