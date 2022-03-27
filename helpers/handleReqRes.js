/* eslint-disable prettier/prettier */
/*
 * Title: Handle request response
 * Description: Handle request response
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */
// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandlers');

// Module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // request handle
    const parseurl = url.parse(req.url, true);
    const path = parseurl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseurl.query;
    const headersObject = req.headers;
    const requestProperties = {
      parseurl,
      path,
      trimmedPath,
      method,
      queryStringObject,
      headersObject,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
      realData += decoder.write(buffer);
    });
    req.on('end', () => {
      realData += decoder.end();
      chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        payload = typeof payload === 'object' ? payload : {};
        const payloadString = JSON.stringify(payload);

        // return the final response
        res.writeHead(statusCode);
        res.end(payloadString);
      });
      // response handle
    res.end('Hello Bhutu !!!!');
    });
    };

module.exports = handler;
