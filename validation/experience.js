const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(data) {
    let errors = {};
    const regIsEmail = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;

    // sprawdzamy najpierw czy jest pusty używając funcki z is-empty.js jeśli nie jest to będzie to co wpisał user, jeśli nic nie wpisał to data.name = ''; pusty string

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // ten warunek nie działa dlatego zastąpiłem go wyrażeniem regularnym
    // if (!Validator.isEmail(data.email)) {
    //     console.log(data.email)
    //     errors.email = 'Email is invalid';
    // }

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required';
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};