db.companies.aggregate([{
    $group: {
      _id: {
        founded_year: "$founded_year"
      },
      average_number_of_employees: {
        $avg: "$number_of_employees"
      }
    }
  }, {
    $sort: {
      average_number_of_employees: -1
    }
  }

])

db.companies.aggregate([{
  $match: {
    founded_year: 2001
  }
}, {
  $project: {
    _id: 0,
    name: 1,
    number_of_employees: 1
  }
}, {
  $sort: {
    number_of_employees: -1
  }
}])


db.companies.aggregate([{
  $match: {
    "relationships.person": {
      $ne: null
    }
  }
}, {
  $project: {
    relationships: 1,
    _id: 0
  }
}, {
  $unwind: "$relationships"
}, {
  $group: {
    _id: "$relationships.person",
    count: {
      $sum: 1
    }
  }
}, {
  $sort: {
    count: -1
  }
}])

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
    "relationships.person.permalink": "tim-hanlon"
  }
}, {
  $project: {
    "permalink": 1
  }
}, {
  $sort: {
    count: -1
  }
}]).pretty()

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
    countDistinct: {
      $sum: "$count"
    },
    total: {
      $sum: 1
    }
  }
}, {
  $sort: {
    count: -1
  }
}]).pretty()