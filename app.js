// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialize
var app = express();

// Connect to database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('MongoDb listening on port: \x1b[32m%s\x1b[0m', '27017');
});

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'success'
    });
});

// LoadExpress
app.listen(3000, () => {
    console.log('Express server listening on port: \x1b[32m%s\x1b[0m', '3000');
});