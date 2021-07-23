const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");

const connectDB = require('./config/db');
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

const userAuthRoutes = require('./routes/auth.userRoute')
app.use('/api', userAuthRoutes)


const port = Process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));