var socket;
var msgQueue = []

// auto reconnect
var connect = function () {
  // socket = new WebSocket(`ws://192.168.8.253:1000`)
  socket = new WebSocket(`ws://${location.hostname}:1000`)

  // Connection opened
  socket.addEventListener('open', function (event) {
    console.info('connected')
    socket.send('Hello Server! from ' + window.location.href);

    // resolve message queue
    for(var i = 0; i < msgQueue.length; i++) {
      socket.send(msgQueue[i])
    }
    msgQueue = []
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    var data = event.data
    console.info('Message from server ', data);
    if (typeof data == 'string' && data.indexOf('javascript:') == 0) {
      try {
        eval(data.replace('javascript:', ''))
      }
      catch (e) {

      }
    }
  });

  socket.addEventListener('close', function () { console.info('closed'); setTimeout(connect, 3000) })
  socket.addEventListener('error', function () { console.info('error'); })
}
connect()

// report messages
function send() {
  try {
    var msg = flatArguments(arguments)
    if (socket.readyState != socket.OPEN) {
      msgQueue.push(msg)
    }
    else {
      socket.send(msg)
    }
  } catch (e) {

  } finally {

  }
}

// transform arguments to string
function flatArguments(args) {
  var result = []
  var len = args.length
  for (var i = 0; i < len; i++) {
    var value = args[i]
    // prevent undefined and null
    if(value === undefined || value === null) {
      value = '' + value
    }
    // transform arguments
    else if (value.toString() == "[object Arguments]") {
      value = flatArguments(value)
    }
    // transform object
    else if (typeof value == 'object') {
      value = JSON.stringify(value)
    }
    result.push(value)
  }
  return result.join()
}

// catch window error
window.addEventListener('error', function (e) {
  send(e.message, e.lineno, e.colno, e.error ? e.error.stack : undefined)
  if (e.message == 'Script error.') {
    send('use try-catch to view more detail')
  }
})

// report console.log
window.console.log = function() {
  send(arguments)
  try{
    console.info.apply(null, arguments)
  } catch(e) {

  }
}

// report console.error
window.console.error = function() {
  send('error log', arguments)
  try{
    console.warn.apply(null, arguments)
  } catch(e) {

  }
}
