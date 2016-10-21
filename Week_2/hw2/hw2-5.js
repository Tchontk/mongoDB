/**
 * As a follow up to the previous question, 
 * how many documents in the video.movieDetails collection 
 * list both "Comedy" and "Crime" as genres 
 * regardless of how many other genres are listed?
 */

db.movieDetails.find({
  $and: [{
    genres: "Comedy"
  }, {
    genres: "Crime"
  }]
}, {
  genres: 1,
  _id: 0
});

db.movieDetails.count({
  $and: [{
    genres: "Comedy"
  }, {
    genres: "Crime"
  }]
}, {
  genres: 1,
  _id: 0
});