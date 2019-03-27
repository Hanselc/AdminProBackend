// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Google Auth
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
  }

app.post('/google', async (req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch( e => {
            return res.status(400).json({
                ok: false,
                message: 'Cannot login',
                errors: e
            });
        });

    User.findOne({email: googleUser.email}, (err, usr) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error while searching user',
                errors: err
            });

        if(usr) {
            if(!usr.google) {
                return res.status(400).json({
                    ok: false,
                    message: 'Cannot login',
                    errors: err
                });
            } else {
                // Create token
                var token = jwt.sign({ user: usr }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: usr,
                    id: usr.id,
                    token: token
                });
            }
        } else {
            var user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.google = true;
            user.password = ':D';

            user.save((err, userSaved) => {
                if (err)
                    return res.status(400).json({
                        ok: false,
                        message: 'Error creating user',
                        errors: err
                    });
        
                // Create token
                var token = jwt.sign({ user: userSaved }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: userSaved,
                    id: userSaved._id,
                    token: token
                });
            });
        }        
    });
});

// Legacy Auth
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
            id: usr._id,
            token: token
        });
    });
});

module.exports = app;