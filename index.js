/* eslint-disable prettier/prettier */
/*
 * Title: Uptime Monitoring Application
 * Description: A RestFul API to monitor up or down time of user defined links
 * Author: Anwar Hossen
 * Date: 23/03/2022
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - Module scaffolding
const app = {};

app.config = {
  port: 3000,
};
// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`listening to port ${app.config.port}`);
  });
};

// handle Request Response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
