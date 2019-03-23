var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorScheme = new Schema({
    name: { type: String, required: [true, 'Este campo es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Este campo es requerido'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Este campo es requerido'] }
}, { collection: 'doctors' });

module.exports = mongoose.model('Doctor', doctorScheme);