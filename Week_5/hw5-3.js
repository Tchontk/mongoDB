// mongoimport --drop -d m101 -c profile sysprofile.json

//Use m101
/**
db.profile.distinct("ns")
db.profile.find({ns:/school2.students/}).pretty()
db.profile.find({ns:/school2.students/},{millis:1}).pretty()
db.profile.find({ns:/school2.students/},{millis:1}).sort({millis:-1}).pretty()
 */