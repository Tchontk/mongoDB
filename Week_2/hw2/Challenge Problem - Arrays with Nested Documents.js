/**
 * Suppose our movie details documents are structured 
 * so that rather than contain an awards field that looks like this:
 * What query would we use in the Mongo shell to return 
 * all movies in the video.movieDetails collection 
 * that either won or were nominated for a best picture Oscar? 
 * You may assume that an award will 
 * appear in the oscars array only 
 * if the movie won or was nominated. 
 * You will probably want to create a little sample data 
 * for yourself in order to work this problem.
 */

/*
db.movieDetails.insert({
  title: "test",
  "awards": {
    "oscars": [{
      "award": "bestAnimatedFeature",
      "result": "won"
    }, {
      "award": "bestMusic",
      "result": "won"
    }, {
      "award": "bestPicture",
      "result": "nominated"
    }, {
      "award": "bestSoundEditing",
      "result": "nominated"
    }, {
      "award": "bestScreenplay",
      "result": "nominated"
    }],
    "wins": 56,
    "nominations": 86,
    "text": "Won 2 Oscars. Another 56 wins and 86 nominations."
  }
})
*/
db.movieDetails.find({
  $or: [{
    "awards.text": {
      $regex: /^Won.*/
    }
  }, {
    "awards.text": {
      $regex: /.Nominated.*/
    },
  }],
  "awards.oscars.award": "bestPicture"
}, {
  "awards.oscars": 1,
  _id: 0
});

/**
 * plus simple ....
 * La question n'était pas vraiment clair 
 */
db.movieDetails.find({
  "awards.oscars.award": "bestPicture"
}).pretty();