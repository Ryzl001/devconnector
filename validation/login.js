const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateLoginInput(data) {
    let errors = {};
    const regIsEmail = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;

    // sprawdzamy najpierw czy jest pusty używając funcki z is-empty.js jeśli nie jest to będzie to co wpisał user, jeśli nic nie wpisał to data.name = ''; pusty string

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    // ten warunek nie działa dlatego zastąpiłem go wyrażeniem regularnym
    // if (!Validator.isEmail(data.email)) {
    //     console.log(data.email)
    //     errors.email = 'Email is invalid';
    // }

    if (!regIsEmail.test(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
};