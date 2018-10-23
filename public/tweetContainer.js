const feedSocket = io.connect('/');

document.addEventListener("DOMContentLoaded", () => {
  jQuery(function($) {
    const twitterFeed = $('ul.tweets');
    feedSocket.on('tweetBody', (tweet) => {
      let tweetDisplay = tweetBuilder(tweet)
      twitterFeed.prepend(tweetDisplay);

      if ($("#tweets").children().length > 199){
        let bid = document.getElementById('tweets').lastChild;
        document.getElementById('tweets').removeChild(bid);
      }
    });

  });
})

const tweetBuilder = (tweet) => {
  return (
    '<li class=`tweet`>' +
    '<div class="tweet-header">' +

    '<div class="profile-info">' +
    `<a href="https://twitter.com/${tweet.screen_name}" target="_blank"> <img class="prof-pic" src="${tweet.profile_pic}"/> </a>` +
    `<div class="name">` +
    '<div class="real_name">' + tweet.name + '</div>' +
    `<div class="screen_name"> @${tweet.screen_name} </div>` +
    `</div>` +

    '</div>' +

    `<a href="${tweet.tweet_url}" target="_blank"> <img src="./twitterLogo.png"/> </a>` +
    '</div>' +

    `<div class="tweet-text"> ${tweet.text} </div>` +
    `<div class="tweet-time">${tweet.created_at}</div>` +
    `<div class="tweet-from"> Tweeted from: ${tweet.place_name}</div>` +
    '</div>' +
    '</li>'
  )
}
