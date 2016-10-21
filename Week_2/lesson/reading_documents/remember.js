/**
 * ObjectId : DATE (4) MAC_ADDR (4) PROCESSID (2) COUNTER (3)
 * ==> 12Bytes
 * ==> COUNTER est un increment
 */

db.movieDetails.find({
  rated: "PG-13"
});

//8(PG - 13 AND 2009)
db.movieDetails.find({
  rated: "PG-13",
  year: 2009
});

// Recherche dans l'ordre du tableau, uniquement si ils sont seul dans le tableau !
db.movieDetails.find({
  "writes": ["Joel Coen", "Ethan Coen"]
}).pretty();

// Permet de chercher dans le document 
db.movieDetails.find({
  "tomato.meter": 100
}).pretty();

// Dans le tableau actor
db.movieDetails.find({
  "actors": "Jeff Bridges"
});

// Premier du tableau actor
db.movieDetails.find({
  "actors.0": "Jeff Bridges"
});


// Gestion du curseur
var c = db.moviesScratch.find();
var doc = function () {
  return c.hasNext() ? c.next() : null;
};
c.objsLeftInBatch();
doc();

// Projection
// 0 ==> Exclusion
// Si il n'y a que des exlusions on retourne tout sauf les exclusions
db.moviesScratch.find({
  "title": "Star Trek"
}, {
  title: 1,
  _id: 0
}).pretty();


/**
 * $gt ==> ">"
 * $lt ==> "<"
 * $gt ==> ">="
 * $lt ==> "<="
 * $ne ==> Différent de la valeur saisie (y comprise l'abscence')
 * $in ==> IN
 */
db.moviesScratch.find({
  runtime: {
    $gt: 90,
    $lt: 120
  }
}).pretty();
// note supérieur ou égalà 98 et durée supérieur à 180
db.moviesScratch.find({
  "tomato.meter": {
    $gte: 95
  },
  runtime: {
    $gt: 180
  }
}).pretty();