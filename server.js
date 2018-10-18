//Setup web server and socket
const twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
    path = require('path');
    fetch = require('node-fetch');

const secrets = require('./secrets');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/libs/index.html'))
})

app.get('/map', (req, res) => {
  let results
  fetch('http://bl.ocks.org/mbostock/raw/4090846/us.json')
  .then( (response) => response.text() )
  .then( (body) => {
    results = JSON.parse(body)
    res.send(results)
  });
})

//Setup twitter stream api
const twitterConnection = new twitter({
  consumer_key: secrets.twitterSecrets.consumer_key,
  consumer_secret: secrets.twitterSecrets.consumer_secret,
  access_token_key: secrets.twitterSecrets.access_token_key,
  access_token_secret: secrets.twitterSecrets.access_token_secret
})

let twitterStream = null;

server.listen(process.env.PORT || 8081);

//Create web sockets connection.
io.sockets.on('connection', function (socket) {
  socket.on("start tweets", function() {
    if(twitterStream === null) {
      twitterConnection.stream(
      'statuses/filter', {'locations':'-180,-90,180,90'}, function(twitterStream) {

        twitterStream.on('data', function(data) {
          if (data.place && data.place.country_code == 'US'){
            const maybe_state = data.place.full_name.split(", ")[1]
            const tweetInfo = {
              "state": maybe_state,
              "place_name": data.place.full_name,
              "screen_name": data.user.screen_name,
              "name": data.user.name,
              "text": data.text,
              "hashtags": data.entities.hashtags,
              "profile_pic": data.user.profile_image_url_https,
              "created_at": data.created_at,
              "tweet_url": `https://twitter.com/${data.user.screen_name}/status/${data.id_str}`,
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
  if (twitterStream !== null){
    twitterStream = null;
  }
})
    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});
