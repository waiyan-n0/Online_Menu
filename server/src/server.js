require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use('/menu',require('./routes/menuRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.use((err, req, res, next)=>{
    res.status(400).json({con:false, msg: err.message});
});

mongoose.connect(MONGODB_URL).then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})
}).catch(err => console.log('database connection error',err));