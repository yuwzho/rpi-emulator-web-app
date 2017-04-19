const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const Uuid = require('uuid-lib');
const url = require('url');

const app = express();
const SampleRunner = require('./src/runner.js');

/* ====================== Helpers ========================= */
var credentials = [];
function setupCredential(uid, connstr) {
  credentials.push({
    uid: uid,
    connstr: connstr,
    path: 'sample/main.js'
  });
}

function getCredential(uid) {
  for (var i = 0; i < credentials.length; i++) {
    if (credentials[i].uid === uid) {
      var obj = credentials[i];
      credentials.splice(i, 1);
      return obj;
    }
  }
  return {};
}

/* ======================= Route ========================= */
app.use(bodyParser.json());
app.post('/api/setup', function (req, res) {
  var connstr = req.body.connstr;
  var uid = Uuid.raw();
  var result = setupCredential(uid, connstr);
  if (result) {
    res.status(400).send(JSON.stringify({ error: result }));
  } else {
    res.send(JSON.stringify({ uid: uid }));
  }
});

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
    if (sample) {
      sample.dispose();
    }
    console.log('disconnected');
  });

  var queries = url.parse(ws.upgradeReq.url, true).query;
  if (!queries) {
    ws.send('no connection string found');
    ws.close();
  }
  var uid = queries.uid;
  if (!uid) {
    ws.send('no connection string found');
    ws.close();
  }

  var connstrObj = getCredential(uid);
  if (!connstrObj || !(connstrObj.connstr)) {
    ws.send('no connection string found');
    ws.close();
  }

  console.log(process.cwd());
  try {
    sample = new SampleRunner(connstrObj.path, [connstrObj.connstr], ws);
    sample.run();
  }
  catch (err) {
    console.error(err);
    ws.send('ERROR:\n');
    ws.send(err);
    ws.close();
  }
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
