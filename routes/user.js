// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var auth = require('../middlewares/auth')

var app = express();

var User = require('../models/user');

// Get all users
app.get('/', (req, res) => {
    User.find({}, 'name email img role').exec((err, users) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error loading users',
                errors: err
            });

        res.status(200).json({
            ok: true,
            users: users
        });
    });
});

// Create new user
app.post('/', auth.validateToken, (req, res) => {
    var body = req.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err)
            return res.status(400).json({
                ok: false,
                message: 'error creating user',
                errors: err
            });

        res.status(201).json({
            ok: true,
            user: userSaved,
            requestUser: req.user
        });
    });
});

// Update user
app.put('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    User.findById(id, (err, usr) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error searching user',
                errors: err
            });

        if (!usr)
            return res.status(400).json({
                ok: false,
                message: "user doesn't exists",
                errors: err
            });

        var body = req.body;

        usr.name = body.name;
        usr.email = body.email;
        usr.role = body.role;

        usr.save((err, userSaved) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: 'error updating user',
                    errors: err
                });

            userSaved.password = ':D';
            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });
    });
});

// Delete user
app.delete('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, usr) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error while deleting user',
                errors: err
            });

        if (!usr)
            return res.status(400).json({
                ok: false,
                message: 'user did\'t exists',
                errors: err
            });

        res.status(200).json({
            ok: true,
            user: usr
        });
    });
});

module.exports = app;