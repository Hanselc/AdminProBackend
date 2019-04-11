// Requires
var express = require('express');
var auth = require('../middlewares/auth');
var app = express();
var Doctor = require('../models/doctor');

// Get all doctors
app.get('/', (req, res) => {

    var from = req.query.from || 0;
    from = Number(from);

    Doctor.find({}, 'name image user hospital')
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    message: 'error loading doctors',
                    errors: err
                });
            Doctor.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    doctors: doctors,
                    total: count
                });
            });
        });
});

// Get a specific doctor
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Doctor.findById(id)
        .populate('user', 'name email image')
        .populate('hospital')
        .exec((err, doctor) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    message: 'error searching doctor',
                    errors: err
                });

            if (!doctor)
                return res.status(400).json({
                    ok: false,
                    message: "doctor doesn't exists",
                    errors: err
                });
            res.status(201).json({
                ok: true,
                doctor: doctor
            });
        });
});

// Create new doctor
app.post('/', auth.validateToken, (req, res) => {
    var body = req.body;
    var doctor = new Doctor({
        name: body.name,
        image: body.image,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, doctorSaved) => {
        if (err)
            return res.status(400).json({
                ok: false,
                message: 'error creating doctor',
                errors: err
            });

        res.status(201).json({
            ok: true,
            doctor: doctorSaved,
            requestUser: req.user
        });
    });
});

// Update doctor
app.put('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    Doctor.findById(id, (err, doctor) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error searching doctor',
                errors: err
            });

        if (!doctor)
            return res.status(400).json({
                ok: false,
                message: "doctor doesn't exists",
                errors: err
            });

        var body = req.body;

        doctor.name = body.name;
        doctor.image = body.image;
        doctor.hospital = body.hospital;
        doctor.user = req.user._id;

        doctor.save((err, doctorSaved) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: 'error updating hospital',
                    errors: err
                });

            doctorSaved.password = ':D';
            res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });
        });
    });
});

// Delete doctor
app.delete('/:id', auth.validateToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctor) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'error while deleting doctor',
                errors: err
            });

        if (!doctor)
            return res.status(400).json({
                ok: false,
                message: 'doctor doesn\'t exists',
                errors: err
            });

        res.status(200).json({
            ok: true,
            doctor: doctor
        });
    });
});

module.exports = app;