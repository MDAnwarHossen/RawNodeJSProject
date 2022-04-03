/* eslint-disable prettier/prettier */
/*
 * Title: User Handler
 * Description: User Handler
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJson } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

console.log(hash);

// Module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler.users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler.users = {};

handler.users.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user already doesn't exist
        data.read('users', phone, (err1, user) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the new user to DB
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'user account already may exists',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handler.users.get = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        // verify the token
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler.token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup the user
            data.read('users', phone, (err, u) => {
            const user = { ...parseJson(u) };
            if (!err && user) {
               delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'requested user was not found',
                });
            }
        });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'requested user was not found',
        });
    }
};
handler.users.put = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler.token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // check the user in DB
                data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJson(uData) };
                if (!err1 && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }
                    // update to DB
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'data updated successfully',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in server',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have a problem in your request',
                    });
                }
            });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
        } else {
            callback(400, {
                error: 'You have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. Try again',
        });
    }
};
handler.users.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler.token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                data.read('users', phone, (err1, user) => {
                    if (!err1 && user) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'successfully deleted',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was server side error',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'There was server side error',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid request',
        });
    }
};
module.exports = handler;
