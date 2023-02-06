let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

app.use(express.static('client'));

let io = require('socket.io')(server);

io.on('connection', function(socket) {
  
  socket.on('message', function(msg) {
    console.log('Received Message: ', msg);
    if (!isQuestion(msg)) {
      io.emit('message', msg);
    } else if (askingTime(msg)) {
      io.emit('message', new Date);
    } else if (askingWeather(msg)) {
      getWeather(function(weather) {
        console.log("Asking Weather");
        io.emit('message', weather);
      });
    }
  });
});

function isQuestion(msg) {
  return msg.match(/\?$/);
}

function askingTime(msg) {
  return msg.match(/time/i);
}

function askingWeather(msg) {
  return msg.match(/weather/i);
}

function getWeather(callback) {
  console.log("Asking Weather");
  let request = require('request');
  request.get("https://api.openweathermap.org/data/2.5/weather?id=6167865&units=metric&appid={api_key}", function(error, response) {
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(response.body);
      console.log(data);
      callback(JSON.stringify(data));
    }
  });
}
 

server.listen(8080, function() {
  console.log('Chat server running');
});