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

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
