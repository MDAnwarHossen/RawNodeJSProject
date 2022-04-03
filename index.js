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
const { result } = require('lodash');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - Module scaffolding
const app = {};
data.create('test', 'newFile', { name: 'Bangladesh', age: 51 }, (err) => {
  console.log('error was', err);
});
data.read('test', 'newFile', (err, readResult) => {
  console.log(err, readResult);
});
data.update('test', 'newFile', { name: 'India', age: 80 }, (err) => {
  console.log('error was', err);
});
data.delete('test', 'newFile', (err) => {
  console.log('error was', err);
});

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`listening to port ${environment.port}`);
  });
};

// handle Request Response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
