// Requires
var express = require('express');

var app = express();
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Collection search
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regexp = new RegExp(search, 'i');

    var promise;

    switch (table) {
        case 'hospital':
            promise = searchHospitals(regexp);
            break;
        case 'doctor':
            promise = searchDoctors(regexp);
            break;
        case 'user':
            promise = searchUsers(regexp);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'bad collection'
            });
    }

    promise.then(data => {
        return res.status(200).json({
            ok: true,
            [table]: data
        });
    });
});

// General search
app.get('/all/:search', (req, res) => {

    var search = req.params.search;
    var regexp = new RegExp(search, 'i');

    Promise.all([searchHospitals(regexp), searchDoctors(regexp), searchUsers(regexp)])
        .then(responses => {
            res.status(200).json({
                ok: true,
                hospitals: responses[0],
                doctors: responses[1],
                users: responses[2]
            });
        });
});

function searchHospitals(regexp) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regexp })
            .populate('user', 'name email image')
            .exec((err, hosp) => {
                if (err)
                    reject('error loading hospitals');
                else
                    resolve(hosp);
            });
    });
}

function searchDoctors(regexp) {
    return new Promise((resolve, reject) => {
        Doctor
            .find({ name: regexp })
            .populate('user', 'name email image')
            .populate('hospital')
            .exec((err, doctor) => {
                if (err)
                    reject('error loading doctors');
                else
                    resolve(doctor);
            });
    });
}

function searchUsers(regexp) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role image')
            .or([{ name: regexp }, { email: regexp }])
            .exec((err, user) => {
                if (err)
                    reject('error loading users');
                else
                    resolve(user);
            });
    });
}

module.exports = app;