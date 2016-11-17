db.companies.aggregate([{
  $match: {
    "relationships.person": {
      $ne: null
    }
  }
}, {
  $project: {
    "permalink": 1,
    relationships: 1,
    _id: 0
  }
}, {
  $unwind: "$relationships"
}, {
  $match: {
    "relationships.person.permalink": "eric-di-benedetto"
  }
}, {
  $group: {
    "_id": {
      "person": "$relationships.person",
      "permalink": "$permalink",
    },
    count: {
      $sum: 1
    }
  }
}, {
  $group: {
    _id: "$_id.person",
    total: {
      $sum: "$count"
    },
    distinct: {
      $sum: 1
    }
  }
}, {
  $sort: {
    count: -1
  }
}]).pretty()