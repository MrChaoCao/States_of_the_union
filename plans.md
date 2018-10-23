Restructure app:

Backend:
Start twitter stream
  on incoming tweet -> emit tweet to
    1. Feed Component, array of tweets
      a. filter tweets by location data
      b. parse tweet
      c. style tweet
      d. unshift tweet to feed. 
        i. check feed length
        ii. if (feed length >= max) pop() feed
    2. Map Component
      a. analyze tweet for origin state
      b. increment state size array
      c. render map
