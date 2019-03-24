// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

app.use(fileUpload());

app.put('/:type/:id', (req, res) => {

    var type = req.params.type;
    var id = req.params.id;

    var allowedTypes = ['hospitals', 'doctors', 'users'];
    if (allowedTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Collection type invalid',
            errors: { message: 'Collection type invalid' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Files not found',
            errors: { message: 'Files not found' }
        });
    }

    var file = req.files.image;
    var fragments = file.name.split('.');
    var extension = fragments[fragments.length - 1];

    var allowedExtension = ['png', 'jpg', 'gif', 'jpeg'];

    if (allowedExtension.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'File extension invalid',
            errors: { message: 'File extension invalid' }
        });
    }

    var fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    var path = `./upload/${type}/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error while uploading the file',
                errors: err
            });
        }
    });

    uploadByType(type, id, fileName, res);
});

function uploadByType(type, id, fileName, response) {
    switch (type) {
        case 'users':
            User.findById(id, (err, usr) => {
                if (!usr)
                    return response.status(400).json({
                        ok: false,
                        message: "User doesn't exists",
                        errors: err
                    });

                var oldPath = './upload/users/' + usr.image;
                if (fs.existsSync(oldPath))
                    fs.unlink(oldPath, err => {});

                usr.image = fileName;
                usr.save((err, resSaved) => {
                    if (err)
                        return response.status(500).json({
                            ok: false,
                            message: 'Error updating user',
                            errors: err
                        });
                    resSaved.password = ':D';
                    return response.status(200).json({
                        ok: true,
                        message: 'Successful uploaded',
                        [type]: resSaved
                    });
                });
            });
            break;
        case 'doctors':
            Doctor.findById(id, (err, doc) => {
                if (!doc)
                    return response.status(400).json({
                        ok: false,
                        message: "Doctor doesn't exists",
                        errors: err
                    });

                var oldPath = './upload/doctors/' + doc.image;
                if (fs.existsSync(oldPath))
                    fs.unlink(oldPath, err => {});

                doc.image = fileName;
                doc.save((err, resSaved) => {
                    if (err)
                        return response.status(500).json({
                            ok: false,
                            message: 'Error updating doctor',
                            errors: err
                        });
                    return response.status(200).json({
                        ok: true,
                        message: 'Successful uploaded',
                        [type]: resSaved
                    });
                });
            });
            break;
        case 'hospitals':
            Hospital.findById(id, (err, hosp) => {
                if (!hosp)
                    return response.status(400).json({
                        ok: false,
                        message: "Hospital doesn't exists",
                        errors: err
                    });

                var oldPath = './upload/hospitals/' + hosp.image;
                if (fs.existsSync(oldPath))
                    fs.unlink(oldPath, err => {});

                hosp.image = fileName;
                hosp.save((err, resSaved) => {
                    if (err)
                        return response.status(500).json({
                            ok: false,
                            message: 'Error updating hospital',
                            errors: err
                        });
                    return response.status(200).json({
                        ok: true,
                        message: 'Successful uploaded',
                        [type]: resSaved
                    });
                });
            });
            break;
    }
}

module.exports = app;