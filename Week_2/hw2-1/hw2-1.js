//\mongoDB\m101JS\Week_2\lesson\creating_documents
mongorestore dump
show dbs
use video
show collection

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