# Index
## Goal
* __Efficient__ Read/Write operation
* __Selectivity__ - Minimize records scanned
* Other ops - How are __sorts__ handled ? 
## Rules
#### Equality field
* Field on which queries will perform an equality test
#### Sort field
* Field on which queries will specify a sort
#### Range field
* Field on which queries perform a range test



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
### COLLSCAN : Not Good
### IXSCAN : Good

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

## Unique Indexes
```javascript
db.stuff.drop()
db.stuff.insert({thing:"apple"});
db.stuff.insert({thing:"pear"});
db.stuff.insert({thing:"apple"});
db.stuff.createIndex({thing:1}); // OK
db.stuff.dropIndex({thing:1}); // OK
db.stuff.createIndex({thing:1}, {unique:true}); // Unique Index KO
db.stuff.remove({thing: "apple"}, {justOne: true})

db.students.createIndex({student_id:1, class_id:1}, {unique:true}); // Unique Index KO
```

## Sparse Indexes
* The index will be smaller than it could if it were no sparse
* You can gain greater flexibility with creating Unique indexes
```javascript
db.stuff.createIndex({thing:1}, {unique:true, sparse:true});
// Par contre full scan pour les sort 
db.stuff.find().sort({thing:1});
```

## Index Creation
### Foreground
* Default
* Faster
* Block Writer / Reader on same datebase collection
* Not for production system
### Background
* Slower
* Don't block reader / Writer
* Can build many background index at a time per database
* Although the database server will continuer to take request
* A background index creation still blocks the mongo shell that you are using to create the index
### Pro tips
* Avec MongoDB replicate
** Utiliser un serveur pour créer l'index en Foreground

```javascript
db.students.createIndex({'scores.score':1}, {background:true});
```

## Explain
* Affiche l'index utilisé
* Affiche les index refusés
```javascript
var exp = db.example.explain();
exp.help();
```
### queryPlanner
* Default
### executionStats
* Include Query planner mode
### allPlansExecution
* Include Query planner mode
* Include Execution stats mode
* Execution information about alternative paths to satifying query


## Covered Queries
* Only use indexes 
* Aucun accès en lecture aux documents
```javascript
db.numbers.createIndex(i:1, j:1, k:1);
// Not Covered Queries ==> _id
db.numbers.explain().find({i:45, j:23})
// Covered Queries
db.numbers.explain().find({i:45, j:23}, {_id:0, i:1, j:1, k:1}) 
// Not Covered Queries
// Analyse du document pour savoir si il existe d'autres clefs que i,j,k
db.numbers.explain().find({i:45, j:23}, {_id:0})

db.foo.createIndex( { a : 1, b : 1, c : 1 } )
db.foo.find( { b : 3, c : 4 } ) // KO
db.foo.find( { a : 3 } ) // OK
db.foo.find( { c : 1 } ).sort( { a : 1, b : 1 } ) // OK
db.foo.find( { c : 1 } ).sort( { a : -1, b : 1 } ) // KO
```
### The overriding principle
* you must use a left-subset (or "prefix") of the index. 
* For sorting, it must either match the index orientation, 
* Or match its reverse orientation, which you can get when the btree is walked backwards.

## Index sized
* Working Set in memory
* __Index must be in memory__
### wiredTiger
* Compresse les index
* Demande plus de CPU
* Le résultat peu varier suivant le type de donnée
```javascript
db.students.stats()
db.students.totalIndexSize()
```

## Index cardinality
### Regular
* 1 : 1 
* Autant d'entrée dans l'index que dans le document
### Sparse
* inférieur ou égal au nombre d'entrée du document 
### Multikey
* Supérieur au nombre d'entrée du document 


## Geospatial Indexes
```javascript
// une entrée dans le document du type "location": [x,y]
// Un index 
db.foo.ensureIndex({location: '2d'})
// une recherche ==> Increase distance
db.foo.find({location:{$near:[x,y]}})
db.foo.find({location:{$near:[x,y]}}).limit(20)
```
## Geospatial Sperical Indexes
### geojson.org
```javascript
db.foo.ensureIndex({location: '2dsphere'})
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinate: [120, 40]
      },
      $maxDistance: 2000
    }
  }
}).pretty()
db.stores.find({
  loc: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-130,30]
      },
      $maxDistance: 1000000
    }
  }
})
```
```console
mongo < foo.js
```


## Test Indexes
```javascript
db.sentences.ensureIndex({words:'text'})
db.sentences.find({$text:{$search:'dog'}})
db.sentences.find({$text:{$search:'dog cat'}}) // OR operator

db.sentences.find({
  $text: {
    $search: 'dog cat'
  }
}, {
  score: {
    meta: 'textScore'
  }
}).sort({
  score: {
    $meta: 'textScore'
  }
})
```

## Hint
```javascript
db.students.find({
  student_id: {
    $gt: 500000
  },
  class_id: 54
}).sort({
  student_id: 1
}).hint({
  class_id
});
```

## Profiler
### 0 - Default offers
### 1 - Slow queries
### 2 - All queries

## Mongotop 
* Where mongo spending time I/O

# Mongostat


## Sharding
* mongos (router)
* Multi mongod (with replica Set)
* Shard = Replica Set