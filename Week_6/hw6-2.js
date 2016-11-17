db.grades.aggregate([{
  $unwind: "$scores"
}, {
  $match: {
    "scores.type": {
      $ne: "quiz"
    }
  }
}, {
  $group: {
    "_id": {
      "student_id": "$student_id",
      "class_id": "$class_id",
    },
    score: {
      $avg: "$scores.score"
    }
  }
}, {
  $group: {
    _id: "$_id.class_id",
    score: {
      $avg: "$score"
    }
  }
}, {
  $sort: {
    score: -1
  }
}]).pretty()