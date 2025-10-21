// services/api-gateway/src/index.js
const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// A single, simple rule for the ENTIRE auth service
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL, {
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

// A single, simple rule for the ENTIRE booking service
app.use('/api/bookings', proxy(process.env.BOOKING_SERVICE_URL, {
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/api/bookings', '');
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