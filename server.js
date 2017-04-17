const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const SampleRunner = require('./src/runner.js');

/* ======================= Route ========================= */
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

const server = http.createServer(app);

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/* ===================== Web Socket ======================= */
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  var sample;
  ws.on('close', function onClose() {
    if(sample) {
      sample.dispose();
    }
    console.log('disconnected');
  });

  sample = new SampleRunner([''], ws);
  sample.run();
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
