const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    datetime: Date,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    subject: String,
    duration: Number,
    notes: String,
    canceled: Boolean,
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment