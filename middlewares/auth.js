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

// Validate Admin
exports.validateAdmin = function(req, res, next) {

    var user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'invalid token',
            errors: { message: 'invalid token' }
        });
    }
};

// Validate Admin or same user
exports.validateAdminOrSUser = function(req, res, next) {
    var user = req.user;
    var id = req.params.id;

    if (user.role === 'ADMIN_ROLE' || user._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'invalid token',
            errors: { message: 'invalid token' }
        });
    }
};