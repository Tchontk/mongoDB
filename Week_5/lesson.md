## Storage Engines
### Impact
* Data File format
* Format of Indexes
### NO impact
* Architecture of a cluster
* The wire protocol for the drivers

### MMAP
* default 
* MMAPv1 automatically allocates power-of-two-sized documents when new documents are inserted
** This is handled by the storage engine.
* MMAPv1 is built on top of the mmap system call that maps files into memory
** This is the basic idea behind why we call it.
* WRONG - MMAPv1 offers document-level locking WRONG
** It has __collection__ level locking.
* WRONG - MongoDB manages the memory used by each mapped file, deciding which parts to swap to disk.
** The __operating system__ handles this.

### Wired Tiger
```console
mongod -dbpath c:\data\db\WT -storageEngine wiredTiger
```
* Documents-level concurrency
* Compression
* Copy documents for update
** No padding 
```javascript
db.collection.stats()
```

## Indexes
```javascript
db.students.explain().find({student_id:5});
db.students.explain(true).find({student_id:5});

db.students.createIndex({student_id:1});
db.students.createIndex({student_id:1, class_id:-1});
db.students.getIndexes()
db.students.dropIndexes({student_id:1})

db.students.insert({class:"yuyi", student_name: "tom"});
db.students.insert({class:"yuyi4", student_name: "tom2"});
db.students.insert({class:"yuyi", student_name: "tom3"});

//db.students.createIndex({class:1, student_name:1});
```

## Multikey Indexes
* Ne marche pas sur deux tableaux (__compound__)
### Exemple
```javascript
db.foo.insert({a:1, b:1});
db.foo.createIndex({a:1, b:1}); // isMultiKey : wrong -- indexName : a_1_b_1
db.foo.find({a:1, b:1}) // OK 
db.foo.insert({a:3, b:[3,4,5]})
db.foo.createIndex({a:1, b:1}); // isMultiKey : true
db.foo.find({a:1, b:1}) // KO
db.foo.find({a:3, b:5}) // OK
db.foo.insert({a:[3,4,6], b:[3,4,5]}) // KO - mono array
db.foo.insert({a:[3,4,6], b:7}) // !! OK - mono array
```

## Dot Notation and Multikey
```javascript
db.students.createIndex({'scores.score': 1});
db.students.find({'scores': {$elemMatch: {type: 'exam', score{'$gt':99.8}}}}).count();
// index first and scan $elemMatch result from index
db.students.find({'$and': [{'scores.type': 'exam'}, {'scores.score': {'$gt':99.8}}]}).count()
// index first and scan "scores.type" from index

db.people.createIndex({'work_history.company': -1}); // Descending
```