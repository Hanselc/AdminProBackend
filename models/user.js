var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

var userScheme = new Schema({
    name: { type: String, required: [true, 'Este campo es requerido'] },
    email: { type: String, unique: true, required: [true, 'Este campo es requerido'] },
    password: { type: String, required: [true, 'Este campo es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
});

userScheme.plugin(uniqueValidator, { message: '{PATH} must be unique'});

module.exports = mongoose.model('User', userScheme);