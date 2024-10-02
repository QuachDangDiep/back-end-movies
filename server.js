const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moviesRoutes = require('./routes/movies');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/movies', moviesRoutes);
app.use('/api/users', usersRoutes);

// Chạy server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
