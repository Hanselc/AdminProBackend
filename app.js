// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Middlewares
var cors = require('./middlewares/cors')

var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imageRoutes = require('./routes/image');


// Initialize
var app = express();

// CORS
app.use(cors.corsValidator);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('MongoDb listening on port: \x1b[32m%s\x1b[0m', '27017');
});

// Serve Static Files
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/upload'));

// Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/image', imageRoutes);
app.use('/', appRoutes);

// LoadExpress
app.listen(3000, () => {
    console.log('Express server listening on port: \x1b[32m%s\x1b[0m', '3000');
});