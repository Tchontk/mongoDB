// Le champ existe 
db.moviesDetails.find({
  "tomato.meter": {
    $exists: true
  }
});

// Le champ n'existe pas '
db.moviesDetails.find({
  "tomato.meter": {
    $exists: false
  }
});

// Value of $type may be either a BSON type number or the string alias
// See https://docs.mongodb.org/manual/reference/operator/query/type
db.moviesScratch.find({
  _id: {
    $type: "string"
  }
});
// _id est normalement un objectId