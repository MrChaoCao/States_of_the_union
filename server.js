const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const path = require('path');
const fetch = require('node-fetch');

const twitter = require('twitter');
const secrets = require('./secrets');

server.listen(process.env.PORT || 8081);

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/libs/index.html'))
})

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, './public/cartogramJSON.json'))
})

const twitterConnection = new twitter({
  consumer_key: secrets.twitterSecrets.consumer_key,
  consumer_secret: secrets.twitterSecrets.consumer_secret,
  access_token_key: secrets.twitterSecrets.access_token_key,
  access_token_secret: secrets.twitterSecrets.access_token_secret
})

io.on('connection', (socket) => {
  console.log('connection');
  twitterConnection.stream('statuses/filter', {'locations':'-180,-90,180,90'}, (twitterStream) => {
    twitterStream.on('data', (streamTweets) => {
      const tweetInfo = tweetParser(streamTweets)
      if (tweetInfo && tweetInfo.state){
        socket.volatile.emit('tweetBody', tweetInfo);
      }
    });
  });
});

const tweetParser = (tweet) => {
  if (tweet.place && tweet.place.country_code == 'US'){
    return {
      "state": tweet.place.full_name.split(", ")[1],
      "place_name": tweet.place.full_name,
      "screen_name": tweet.user.screen_name,
      "name": tweet.user.name,
      "text": tweet.text,
      "hashtags": tweet.entities.hashtags,
      "profile_pic": tweet.user.profile_image_url_https,
      "created_at": tweet.created_at,
      "tweet_url": `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
    }
  }
}
