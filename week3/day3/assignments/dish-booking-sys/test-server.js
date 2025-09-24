const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Simple test server is working!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
  console.log('Visit: http://localhost:3000/health');
});