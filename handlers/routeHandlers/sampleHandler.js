/* eslint-disable prettier/prettier */
/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */

// Module scaffolding
const handler = {};
handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample URL',
    });
};
module.exports = handler;
