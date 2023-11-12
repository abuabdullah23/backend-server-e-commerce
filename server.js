const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utils/dbConnect');
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: [process.env.CLIENT_SIDE_DASHBOARD_URL, process.env.CLIENT_SIDE_URL],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser())

// all routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));
app.use('/api', require('./routes/dashboard/productRoutes'));
app.use('/api', require('./routes/dashboard/sellerRoutes'));

// client side routes
app.use('/api/client', require('./routes/home/homeRoutes'));


// call mongoose db
dbConnect();

app.get('/', (req, res) => {
    res.send('Server is Running');
})

app.listen(port, () => {
    console.log('Server is running on port:', port);
})