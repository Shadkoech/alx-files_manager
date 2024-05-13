const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Fetching all routes from routes/index.js
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
