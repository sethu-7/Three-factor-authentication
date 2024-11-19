






// File: server.js
const express = require('express');
const connectDB = require('./config/database');
const wsnRoutes = require('./routes/wsn');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api', wsnRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});