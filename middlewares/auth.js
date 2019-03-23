var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Validate Token
exports.validateToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                message: 'invalid token',
                errors: err
            });

        req.user = decoded.user;
        next();
    });
};