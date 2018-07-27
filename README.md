# States of the Union
A data visualization that shows the frequency twitter users in different states tweet. The app renders a map where state sizes are determined by frequency of tweets rather than by land mass of the state.

[Link to live site](https://twitter-states.herokuapp.com/)

# Technologies
This app was created with Node.js and utilizes websockets and the Twitter API to stream tweets in real time. The D3.js library is used to render tweet counts as a non contiguous cartogram.

The Twitter streaming API endpoint was used for this project. The streaming API gives access to a random sample of tweets in near real-time which are read by a node server and processed for location data.

Tweets originating from one of the 50 American states are collected and displayed on the app in as they are received. These tweets are also used to build a non-contiguous cartogram 

# Future Features
- [ ] Content filters. Allow users to see state based twitter trends.
- [ ] Population normalization. Currently the most populous tweets dominate the map. Normalizing state growth rate for population would show if residents of particular states were heavier tweeters.
- [ ] Variable growth rate. Currently states grow at a fixed rate per tweet. Future developments could include allowing users to set the rate at which states grow in size.

A D3 data visualization built with Node.js
