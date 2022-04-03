/* eslint-disable prettier/prettier */
/*
 * Title: uitilities
 * Description: Handle all uitilities related things
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/20/2020
 *
 */
// dependencies
const crypto = require('crypto');
const environments = require('./environments');
// module scaffolding
const uitilities = {};
// parse JSON string to object
uitilities.parseJson = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};
// hash string
uitilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey)
        .update(string)
        .digest('hex');
        return hash;
    }
        return false;
};
// Create token string
uitilities.createRandomString = (stringlength) => {
    let length = stringlength;
    length = typeof stringlength === 'number' && stringlength > 0 ? stringlength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';
        let output = '';
        for (let I = 0; I <= length; I++) {
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length),
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

// export module
module.exports = uitilities;
