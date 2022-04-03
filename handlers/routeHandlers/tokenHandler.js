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
const { createRandomString } = require('../../helpers/utilities');
const { parseJson } = require('../../helpers/utilities');

// Module scaffolding
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler.token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler.token = {};

handler.token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJson(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                // store the token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'Something went wrong in the server side',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Invalid password',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handler.token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false;
    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJson(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'requested token was not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'requested token was not found',
        });
    }
};
handler.token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 21 ? requestProperties.body.id : false;
    const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;
    if (id && extend) {
        data.read('tokens', id, (err, tokenData)=>{
            let tokenObject = parseJson(tokenData);
            if (!err && tokenObject.expires> Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the updated token
                data.update('tokens', id, tokenObject, (err)=>{
                    if (!err) {
                        callback(200); 
                    }else{
                        callback(500, {
                            error: 'There was a server side error',
                        });
                    }
                } )
            }else{
                callback(400, {
                    error: 'Token already expired or invalid',
                });
            }
        })
    }else{
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};
handler.token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 21 ? requestProperties.queryStringObject.id : false;
    if (id) {
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
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
        callback(400, {
            error: 'Invalid request',
        });
    }
};

handler.token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tData) => {
        if (!err && tData) {
            const tokenData = parseJson(tData);
            if (tokenData.phone === phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};
module.exports = handler;
