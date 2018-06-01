//Setup web server and socket
const twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
const path = require('path');
const fetch = require('node-fetch');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/libs/index.html'))
})

//D3 visualization
app.get('/map', (req, res) => {
  let results
  fetch('http://bl.ocks.org/mbostock/raw/4090846/us.json')
  .then(function(response) {
    return response.text();
  }).then(function(body) {
    results = JSON.parse(body)
    // console.log(typeof body);
    // console.log(body.length);
    // console.log(JSON.parse(body)[0]);
    res.send(results)
  });

})

//Setup twitter stream api
const twit = new twitter({
  consumer_key: 'q6kzEP9qMkVrM66ujiR1UK5ga',
  consumer_secret: 'g2UxKFwIU9zn6m7UUde5gQ5MZYwYL4gIGYzncfRHW2QHAehrJi',
  access_token_key: '963316414021906433-GThLLTdtdCJtjXFZz34tLc2mtq7Imis',
  access_token_secret: 'xutaud0IildZ0a6FJUNtg9JpnbBm8mYflhyi32frtXllJ'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
          stream.on('data', function(data) {
              // Does the JSON result have coordinates
              if (data.place){
                if (data.place.country_code == 'US'){
                  const maybe_state = data.place.full_name.split(", ")[1]
                  if (maybe_state !== 'USA' && maybe_state !== undefined){
                    const outputPoint = {
                      "state": maybe_state,
                      "screen_name": data.user.screen_name,
                      "name": data.user.name,
                      "text": data.text,
                      "hashtags": data.entities.hashtags,
                      "profile_pic": data.user.profile_image_url_https,
                    }

                    // console.log(maybe_state, outputPoint.text, outputPoint.profile_pic);
                    // console.log(data.text)
                    socket.broadcast.emit("twitter-stream", outputPoint);

                    //Send out to web sockets channel.
                    socket.emit('twitter-stream', outputPoint);
                  }
                }
              }

              // stream.on('limit', function(limitMessage) {
              //   return console.log(limitMessage);
              // });
              //
              // stream.on('warning', function(warning) {
              //   return console.log(warning);
              // });
              //
              // stream.on('disconnect', function(disconnectMessage) {
              //   return console.log(disconnectMessage);
              // });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});
