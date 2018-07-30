const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateEducationInput(data) {
    let errors = {};
    const regIsEmail = /^[a-z\d]+[\w\d.-]*@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i;

    // sprawdzamy najpierw czy jest pusty używając funcki z is-empty.js jeśli nie jest to będzie to co wpisał user, jeśli nic nie wpisał to data.name = ''; pusty string

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // ten warunek nie działa dlatego zastąpiłem go wyrażeniem regularnym
    // if (!Validator.isEmail(data.email)) {
    //     console.log(data.email)
    //     errors.email = 'Email is invalid';
    // }

    if (Validator.isEmpty(data.school)) {
        errors.school = 'Job school field is required';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Fieldofstudy field is required';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};