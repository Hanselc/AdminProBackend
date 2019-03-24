// Requires
var express = require('express');
var auth = require('../middlewares/auth');
var app = express();

var Hospital = require('../models/hospital');

// Get all hospitals
app.get('/', (req, res) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({}, 'name image user')
        .skip(from)
        .limit(5)
        .populate('user', 'name email').exec((err, hospitals) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    message: 'error loading hospitals',
                    errors: err
                });

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospitals: hospitals,
                    total: count
                });
            });
        });
});

// Create new hospital
app.post('/', auth.validateToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        name: body.name,
        image: body.image,
        user: req.user._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err)
            return res.status(400).json({
                ok: false,
                message: 'error creating hospital',
                errors: err
            });

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved,
            requestUser: req.user
        });
    });
});

// Update hospital
app.put('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error searching hospital',
                errors: err
            });

        if (!hospital)
            return res.status(400).json({
                ok: false,
                message: "hospital doesn't exists",
                errors: err
            });

        var body = req.body;

        hospital.name = body.name;
        hospital.image = body.image;

        hospital.save((err, hospitalSaved) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: 'error updating hospital',
                    errors: err
                });

            hospitalSaved.password = ':D';
            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });
        });
    });
});

// Delete hospital
app.delete('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error while deleting hospital',
                errors: err
            });

        if (!hospital)
            return res.status(400).json({
                ok: false,
                message: 'hospital doesn\'t exists',
                errors: err
            });

        res.status(200).json({
            ok: true,
            hospital: hospital
        });
    });
});

module.exports = app;