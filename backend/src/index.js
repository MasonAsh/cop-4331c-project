const express = require('express')
const bodyParser = require('body-parser')
const Appointment = require('./AppointmentDAO')
const jwt = require("jsonwebtoken");
const JwtStrategy = require('passport-jwt').Strategy
const passport = require('passport')
const mongoose = require('mongoose');
var morgan = require('morgan')
const { ExtractJwt } = require('passport-jwt');
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/appointman', { useNewUrlParser: true, useUnifiedTopology: true })

const opts = {
    secretOrKey: 'b3f6ee25e613e005c37cce295ceab01e54af06c6f098150720b366cc1729985c',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

passport.use(new JwtStrategy(opts,
    (payload, done) => {
        let username = payload.username;
        // Hardcoded login credentials per the spec.
        // Good luck figuring this one out hackers ;)
        if (username == 'testuser123') {
            return done(null, { id: 'testuser123' })
        } else {
            return done(null, false)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('combined'))

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // Hardcoded login credentials per specifications.
    if (username == 'testuser123' && password == 'password123') {
        let jwt_payload = {
            username: username,
            password: password,
        }

        jwt.sign(jwt_payload,
            opts.secretOrKey,
            {
                expiresIn: 2592000 // 1 month in seconds
            },
            (err, token) => {
                if (err) {
                    res.json({
                        success: false
                    })
                } else {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                }
            })
    } else {
        res.json({
            success: false
        })
    }
})

app.get('/list_appointments/',
    passport.authenticate('jwt', { session: true }),
    (req, res) => {
        Appointment.find({ datetime: { $gte: new Date() }, canceled: false }).sort({ datetime: 1 }).exec((err, appointments) => {
            if (err) {
                res.status(500).end()
            } else {
                res.json({
                    success: true,
                    appointments: appointments,
                })
            }
        })
    })

app.post('/create_appointment/', function (req, res) {
    let name
    let email
    let phone
    let subject
    let duration
    let datetime
    let notes

    res.setHeader('Content-Type', 'application/json')

    try {
        name = req.body.name;
        email = req.body.email;
        phone = req.body.phone;
        subject = req.body.subject;
        duration = req.body.duration;
        datetime = new Date(req.body.date);
        notes = req.body.notes;
    } catch (error) {
        res.status(400)
        return;
    }

    let appointment = new Appointment({
        datetime: datetime,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        subject: subject,
        notes: notes,
        duration: duration,
        canceled: false
    })

    appointment.save().then(app => {
        res.status(200)
        res.json({
            success: true,
            appointment: app,
        })
    }).catch((err) => {
        res.status(500)
        res.end()
    })
})

app.put('/cancel/', (req, res) => {
    Appointment.findByIdAndUpdate(req.query.id, { canceled: true }, (err, result) => {
        if (err) {
            res.json({
                success: false,
            })
        } else {
            res.json({
                success: true,
                appointment: result,
            })
        }
    })
})

app.get('/status/', (req, res) => {
    Appointment.findById(req.query.id, (err, appointment) => {
        if (err) {
            res.status(404)
            res.json({
                success: false,
            })
        } else {
            res.json({
                success: true,
                appointment: appointment,
            })
        }
    })
})

app.listen(port)

console.log('Running backend API on port ' + port)