const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// Fetching all routes from routes/index.js
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export default app;

// const express = require('express')
// const routes = require('./routes/index')
// const app = express()

// const port = process.env.PORT || 5000

// app.use(express.json())
// app.use('/', routes);

// app.listen(port, ()=>{
//     console.log(`running on port ${port}`)
// })
