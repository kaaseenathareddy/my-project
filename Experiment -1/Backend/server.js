// backend/server.js
const express = require('express');
const cors = require('cors'); // ✅ Make sure this line is present
const app = express();
const port = 5000;

// ✅ This is the key line that enables cross-origin requests
app.use(cors()); 

app.get('/api/data', (req, res) => {
  console.log('Request received on /api/data');
  res.json({ message: 'Hello from the backend! CORS is enabled.' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});