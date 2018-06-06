//Setup web server and socket
const twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
    path = require('path');
    fetch = require('node-fetch');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/libs/index.html'))
})

app.get('/map', (req, res) => {
  let results
  fetch('http://bl.ocks.org/mbostock/raw/4090846/us.json')
  .then(function(response) {
    return response.text();
  }).then(function(body) {
    results = JSON.parse(body)
    res.send(results)
  });
})

//Setup twitter stream api
const twitterConnection = new twitter({
  consumer_key: 'q6kzEP9qMkVrM66ujiR1UK5ga',
  consumer_secret: 'g2UxKFwIU9zn6m7UUde5gQ5MZYwYL4gIGYzncfRHW2QHAehrJi',
  access_token_key: '963316414021906433-GThLLTdtdCJtjXFZz34tLc2mtq7Imis',
  access_token_secret: 'xutaud0IildZ0a6FJUNtg9JpnbBm8mYflhyi32frtXllJ'
}),

stream = null;

server.listen(process.env.PORT || 8081);

//Create web sockets connection.
io.sockets.on('connection', function (socket) {
  socket.on("start tweets", function() {
    if(stream === null) {
      twitterConnection.stream(
      'statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {

        stream.on('data', function(data) {
          if (data.place && data.place.country_code == 'US'){
            const maybe_state = data.place.full_name.split(", ")[1]
            const tweetInfo = {
              "state": maybe_state,
              "screen_name": data.user.screen_name,
              "name": data.user.name,
              "text": data.text,
              "hashtags": data.entities.hashtags,
              "profile_pic": data.user.profile_image_url_https,
            }

            socket.broadcast.emit("twitter-states", tweetInfo);
            //Send out to web sockets channel.
            socket.emit('twitter-states', tweetInfo);
          }

        });
      });
    }
  });

socket.on("end tweets", function(){
  if (stream !== null){
    stream = null;
  }
})
    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});
