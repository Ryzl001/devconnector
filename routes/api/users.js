const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')

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


module.exports = router;