Global-trends
=============
Real time display and filter tweets in a world map, it uses the Google prediction API to apply filters.

  Prototype(not updated to the last version): http://geo-twitter.tomasperez.com

  Backend: Node.js application
   - Retrieve tweets from the Twitter API, using the Twitter Stream API
   - Apply the user defined filters + Google prediction API(https://developers.google.com/prediction/)
   - It uses http://github.com/tomasperezv/blackbriar as MVC engine, but it could be easily adapted to others.
   - Fetch data from the backend using websockets.

  Frontend: Javascript
   - Google maps API


Author
----------
Tomas Perez - tom@0x101.com

http://www.tomasperez.com

License
-----------
Public Domain.

No warranty expressed or implied. Use at your own risk.
