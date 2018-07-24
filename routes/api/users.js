const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json( { msg: 'Users Works' } ));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                // jeśli user o takim mailu istnieje 
                return res.status(400).json({ email: 'Email already exists' })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default 
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    // jeśli key i value jest takie same to można skórcić zostawiając tylko avatar
                        // avatar: avatar,
                    avatar,
                    password: req.body.password
                });
                // generujemy salt dla hasła, w callbacku go otrzymujemy
                bcrypt.genSalt(10, (err, salt) => {
                    // generuje hash używając hasła podanego przez usera i wygenerowanego wcześniej salt
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // przypisujemy wygenerowany hash do hasła usera w bazie danych
                        newUser.password = hash;
                        // zapisujemy wszystko i wysyłamy jako JSON
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email ({email: email}) dlatego, że są takie same to wpisujemy tylko ({email})
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json({email: 'User not found'});
            } 

            // check Password
            bcrypt.compare(password, user.password)
                // zwraca boolean true or false
                .then(isMatch => {
                    // jeśli hasło podane zgadza się z tym z bazy danych to...
                    if(isMatch) {
                        // User Matched

                        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload - jakieś informacje o userze oprócz hasła

                        // Sign Token - wstawiamy payload wcześniej stworzony oraz secret key z katalogu config/keys.js
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, // expiresIn - czas po jakim token zostaje zniszczony i user musi zalogować się jeszcze raz?
                            (err, token) => {  // wysyłamy stworzony token
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );  
                    } else {
                        return res.status(400).json({password: 'Password incorrect'})
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    }); // zamiast wysyłać wszystkie informacje o userze (req.user) wraz z hasłem tworzymy obiekt z info o nim
});


module.exports = router;