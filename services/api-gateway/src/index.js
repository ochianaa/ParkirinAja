// services/api-gateway/src/index.js
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy'); // Import the new library

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// A single, simple rule for the ENTIRE auth service
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL, {
  // This function rewrites the path, replacing '/api/auth' with nothing
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/api/auth', '');
  },
  proxyErrorHandler: function(err, res, next) {
    console.error('[PROXY ERROR]', err);
    res.status(502).json({ message: 'Bad Gateway', error: err.message });
    next(err);
  }
}));

// A single, simple rule for the ENTIRE garage service
app.use('/api/garages', proxy(process.env.GARAGE_SERVICE_URL, {
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/api/garages', '');
  },
  proxyErrorHandler: function(err, res, next) {
    console.error('[PROXY ERROR]', err);
    res.status(502).json({ message: 'Bad Gateway', error: err.message });
    next(err);
  }
}));

app.listen(PORT, () => {
  console.log(`API Gateway is live on port http://localhost:${PORT}`);
});