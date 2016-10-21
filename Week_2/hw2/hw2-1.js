//\mongoDB\m101JS\Week_2\lesson\creating_documents
//mongorestore dump
//show dbs
//use video
//show collection

/**
 * Which of the choices below is the title of a movie 
 * from the year 2013 that is 
 * rated PG-13 and 
 * won no awards? 
 * Please query the video.movieDetails collection to find the answer.
 */

db.movieDetails.findOne({
  rated: "PG-13",
  year: 2013,
  "awards.wins": 0
}, {
  title: 1,
  "awards.wins": 1,
  rated: 1,
  year: 1
});