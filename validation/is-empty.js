// Funkcja sprawdzająca czy input jest pusty

const isEmpty = value => // jeśli jest to funkcja strzałkowa to możemy pominąć nawiasy dla argumentu jeśli jest jeden i nawiasy klamrowe oraz słowo return jeśli zwraca boolean
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;