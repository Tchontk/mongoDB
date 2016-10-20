db.movieDetails.find({
  $or: [{
    "tomato.meter": {
      $gt: 99
    }
  }, {
    "metacritic": {
      $gt: 95
    }
  }]
});

// Utile si multicritère sur le même champ
db.movieDetails.find({
  $and: [{
    "metacritic": {
      $ne: 100
    }
  }, {
    "metacritic" {
      $exists: true
    }
  }]
});


// Les deux écriture ci-dessous sont équivalentes
db.movieDetails.find({
  $and: [{
    "tomato.meter": {
      $gt: 99
    }
  }, {
    "metacritic": {
      $gt: 95
    }
  }]
});

db.movieDetails.find({
  "tomato.meter": {
    $gt: 99
  }
}, {
  "metacritic": {
    $gt: 95
  }
});