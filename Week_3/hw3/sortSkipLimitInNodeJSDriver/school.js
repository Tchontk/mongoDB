//mongoimport -d school -c grades school.json
var cursor = db.grades.find({});
cursor.sort({
  "grade": -1
}).skip(0).limit(2);
//var cursor = db.collection("grades").find({});

db.grades.find().sort({
  "grade": -1
}).skip(0).limit(2);