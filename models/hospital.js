var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalScheme = new Schema({
    name: { type: String, required: [true, 'Este campo es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalScheme);