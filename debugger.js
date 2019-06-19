// sky-watch
// https://github.com/CaiWenlie/sky-watch-js.git

const WebSocket = require('ws');
const express = require('express')
const app = express()

// watch and send reports
const watcher = new WebSocket.Server({ port: 1000 });
// collect reports and control watchers
const reporter = new WebSocket.Server({ port: 1001 });

// broadcast commands to watchers
watcher.broadcast = function (msg) {
  watcher.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// broadcast reports to reporters
reporter.broadcast = function (msg) {
	reporter.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// watcher connected
watcher.on('connection', function connection(ws, req) {
  ws.send('watching');

  // receive reports from watcher
  ws.on('message', function incoming(message) {
    console.log('received: ', message);
    // broadcast to reporters
    reporter.broadcast(message)
  });

  reporter.broadcast(`new client`)
});

// reporter connected
reporter.on('connection', function connection(ws) {
  ws.send(`watching`)

  // receive commands from reporter
  ws.on('message', function incoming(message) {
    if(message.indexOf('javascript:') == 0) {
      console.log('command: ', message);
      // broadcast to watchers
      watcher.broadcast(message)
    }    
  });

});


// page to view reports
app.use('/', express.static('./report'))

app.listen(1002, () => console.log('view reports on http://localhost:1002'))
