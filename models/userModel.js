const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    city: {
        type: String,
    },
    reg_id: {
        type: String,
    },
    device_type: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    }
});


module.exports = User = mongoose.model('user', UserSchema);