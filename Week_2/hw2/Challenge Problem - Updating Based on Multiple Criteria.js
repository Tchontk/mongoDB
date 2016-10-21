/**
 * This problem is provided as a supplementary learning opportunity. 
 * It is more challenging that the ordinary homework. It is ungraded. 
 * We do not ask you submit an answer.
 * Write an update command that will 
 * remove the "tomato.consensus" field 
 * for all documents matching the following criteria:
 * 
 * The number of imdb votes is less than 10,000
 * The year for the movie is between 2010 and 2013 inclusive
 * The tomato.consensus field is null
 * 
 * How many documents required an update to eliminate a "tomato.consensus" field?
 */

/**
 * Ma solution
 * Mauvaise compréhension..
 * J'ai considéré null comme non existant
 */
db.movieDetails.count({
  "imdb.votes": {
    $lt: 10000
  },
  year: {
    $gte: 2010,
    $lte: 2013
  },
  "tomato.consensus": {
    $exists: false
  }
}, {
  "imdb.votes": 1,
  year: 1,
  "tomato.consensus": 1,
  _id: 0
})

/**
 * Solution I 
 * Elle est plus sélective 
 * Mongodb considère le "tomato.consensus" à null si il n'existe pas
 * On a donc 13 résultat pour la première et 204 pour la seconde
 * Par contre pour l'update le résultat est identique 
 * à condition d'utilise $unset pour la seconde requete
 * A contrario il est possible d'utiliser $set pour la première requête 
 * Si le champ n'existe pas $unset ne le créé pas (UPDATE Only) 
 * $set va le créer (UPDATE or INSERT)
 */
db.movieDetails.count({
  "imdb.votes": {
    $lt: 10000
  },
  year: {
    $gte: 2010,
    $lte: 2013
  },
  $and: [{
    "tomato.consensus": {
      $exists: true
    }
  }, {
    "tomato.consensus": null
  }]
}, {
  "imdb.votes": 1,
  year: 1,
  "tomato.consensus": 1,
  _id: 0
})

/**
 * La seconde
 */
db.movieDetails.find({
  "imdb.votes": {
    $lt: 10000
  },
  year: {
    $gte: 2010,
    $lte: 2013
  },
  "tomato.consensus": null
}, {
  "imdb.votes": 1,
  year: 1,
  "tomato.consensus": 1,
  _id: 0
})

/**
 * L'update
 */
db.movieDetails.updateMany({
  year: {
    $gte: 2010,
    $lte: 2013
  },
  "imdb.votes": {
    $lt: 10000
  },
  $and: [{
    "tomato.consensus": {
      $exists: true
    }
  }, {
    "tomato.consensus": null
  }]
}, {
  $unset: {
    "tomato.consensus": ""
  }
});