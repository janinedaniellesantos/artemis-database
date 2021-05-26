const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TripSchema = new Schema({
        tripName: String,
        tripDate: Date,
        tripDuration: String,
        trashGallon: Number,
        trashLog: String
    });

    module.exports = mongoose.model('Trip', TripSchema);