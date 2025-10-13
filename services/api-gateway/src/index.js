const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '', // remove the prefix
  },
}));

// Add other services here later, for example:
// app.use('/api/garages', createProxyMiddleware({ target: process.env.GARAGE_SERVICE_URL, ... }));

app.listen(PORT, () => {
  console.log(`API Gateway is live on port ${PORT}`);
});