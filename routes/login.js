// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, usr) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error while searching user',
                errors: err
            });

        if (!usr) {
            return res.status(400).json({
                ok: false,
                message: 'cannot login',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usr.password)) {
            return res.status(400).json({
                ok: false,
                message: 'cannot login',
                errors: err
            });
        }
        usr.password = ':D';
        // Create token
        var token = jwt.sign({ user: usr }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: usr,
            id: usr.id,
            token: token
        });
    });
});

module.exports = app;