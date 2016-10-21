/**
 * How many documents in our video.movieDetails collection list just the 
 * following two genres: "Comedy" and "Crime" 
 * with "Comedy" listed first.
 */

db.movieDetails.findOne();

db.movieDetails.find({
  $and: [{
    genres: {
      $all: ["Comedy", "Crime"]
    }
  }, {
    genres: {
      $size: 2
    }
  }]
}, {
  genres: 1,
  _id: 0
});

db.movieDetails.count({
  $and: [{
    genres: {
      $all: ["Comedy", "Crime"]
    }
  }, {
    genres: {
      $size: 2
    }
  }]
}, {
  genres: 1,
  _id: 0
});