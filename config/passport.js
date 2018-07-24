const JwtStrategy =  require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt'). ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users'); // inny sposób zaimplementowania na podstawie nazwy modelu, którą tworzyliśmy w models/User.js
const keys = require('../config/keys');

// Options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => { // passport tutaj to jest argument, który też wpisalismy w server.js Passport Config jako argument (do tego się odnosi)
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => { // opts podajemy jako argument a callback zwraca nam jwt_payload (powinien zawierać info o userze, które wcześniej w user.js ustaliliśmy) i done
            User.findById(jwt_payload.id)
                .then(user => {
                    if(user) {
                        return done(null, user); // zwraca drugi parametr 'done' z userem
                    }

                    return done(null, false); // jak nie znajdzie user
                })
                .catch(err => console.log(err));
        }
    )); 
}