const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};
    const regIsEmail = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;
    // sprawdzamy najpierw czy jest pusty używając funcki z is-empty.js jeśli nie jest to będzie to co wpisał user, jeśli nic nie wpisał to data.name = ''; pusty string
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''; // confirm password


    if (!Validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    // zastąpione wyrażeniem regularnym
    // if (!Validator.isEmail(data.email)) {
    //     errors.email = 'Email is invalid';
    // }
    if (!regIsEmail.test(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password must match';
    }





    return {
        errors,
        isValid: isEmpty(errors)
    };
};