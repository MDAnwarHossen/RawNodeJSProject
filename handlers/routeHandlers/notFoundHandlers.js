/* eslint-disable prettier/prettier */
/*
 * Title: Not Found handler
 * Description: 404 Not Found handler
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */

// Module scaffolding
const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
callback(404, {
    message: 'This page was not found',
});
};
module.exports = handler;
