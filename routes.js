/* eslint-disable prettier/prettier */
/*
 * Title: Routes
 * Description: Application Routes
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
};

module.exports = routes;
