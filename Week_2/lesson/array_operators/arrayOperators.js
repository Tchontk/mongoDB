db.movieDetails.find({
  genres: {
    $all: ["Comedy", "Crime", "Drama"]
  }
}).pretty(); // les 3 genres

db.movieDetails.find({
  countries: {
    $size: 1
  }
}).pretty(); // Dans un seul pays
/*
boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.3 },
             { "country": "France", "revenue": 3.5 } ]
*/

// Cette requete va retourne une ligne car USA > 15 and country UK exist
db.movieDetails.find({
  boxOffice: {
    country: "UK",
    revenue: {
      $gt: 15
    }
  }
});

// Pour avoir les deux dans la même ligne (élément) les  deux filtres sont satisfait
db.movieDetails.find({
  boxOffice: {
    $elemMatch: {
      country: "UK",
      revenue: {
        $gt: 15
      }
    }
  }
});