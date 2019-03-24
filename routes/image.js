// Requires
var express = require('express');

var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:type/:img', (req, res) => {
    var type = req.params.type;
    var img = req.params.img;

    var imagePath = path.resolve(__dirname, `../upload/${type}/${img}`);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        var defaultPath = path.resolve(__dirname, '../assets/img/no-img.jpg');
        res.sendFile(defaultPath);
    }
});

module.exports = app;