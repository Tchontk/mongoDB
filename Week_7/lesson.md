## Write Concern 
### W & J value 
* W : 1, j : False ==> Fast on n'attend pas l'écriture du journal sur le DD, uniquement dans la mémoire
* W : 1, j : true ==> Slow , on attend l'écriture du journal sur le DD
* W : 0 ==> Not good

## Network Error
### J & W value 
* Error back even if the write was successful 
* Problème avec les Update
* The network TCP connection between the application and the server was reset after the server received a write but before a response could be sent.
* The MongoDB server terminates between receiving the write and responding to it.
* The network fails between the time of the write and the time the client receives a response to the write.

## Replication
### Replica Set
* 3 server MongoDB au minimum
* #1 Primary, #2 & #3 Secondaries etc ...
* Si le Primary tombe, il y a une "election" pour désigner le nouveau Primary
* Un nouveau serveur est considéré comme un Secondaries
### Elections
* Regular
* Arbiter ==> Ne peut pas être un Primary (Uniquement le droit de voter)
* Delayed Node => Ne peut pas être un Primary (Desaster recovery node ! P = 0)
* Hidden ==> Ne peut pas être un Primary
### Write Consistency
* Ecriture sur le Primary
* Lecture possible sur les Secondaries (Eventual consistencey)
* Pas d'écriture durant la période sans Primary (si il tombe et avant l'élection)


## Creating replica Set
```console
mongod --replSet m101 --logpath "1.log" --dbpath /data/rs1 --port 27017 --oplogSize 64 --smallfiles
mongod --replSet m101 --logpath "2.log" --dbpath /data/rs2 --port 27018 --oplogSize 64 --smallfiles
mongod --replSet m101 --logpath "3.log" --dbpath /data/rs3 --port 27019 --oplogSize 64 --smallfiles
```
````javascript
// Permet de requeter les Secondaries
rs.slaveOk()
````

## Replication Internals
* oplog
* Un gros oplog si énormément d'activité
* Replication supports mixed-mode storage engines. For examples, a mmapv1 primary and wiredTiger secondary.
* A copy of the oplog is kept on both the primary and secondary servers.
* The oplog is implemented as a capped collection.
````javascript
use local
db.oplog.rs.find()
````

## Failover and Rollback
Il et possible de perdre des données si le primary tombe avant que le journal ne soit partagé aves les Secondaries
A la reconnexion l'ancien Primary récupère les infos du nouveau
Constate un entrée "invalide", la rollback et la stoque dans un fichier
Pour empecher ça il faut mettre w=1 pour que le retour à l'application soit effective dans la majorité des Secondaries

## Connect to replica Set
```javascript
rs.status()
rs.initiate()
rs.add("localhost:30001")
```
* The missing node will be discovered as long as you list at least one valid node.

```javascript
// The insert will be buffered until the election completes, then the callback will be called after the operation is sent and a response is received
db.collection('foo').insert({x:1}, callback);
```
* Il faut déclarer les nodes dans la config nodeJS ==> __Seed list__

## Write concern revisited
* w = How many nodes you wait before move on 
* w = 1 ==> Primary
* How long you wait : wtimeout ==> How many time you're going to write to see that you write replicated to other members of the replica set
* j = Journal sur le DD ou pas du primary node
* If you set w=4 on a MongoClient and there are only three nodes in the replica set, how long will you wait in PyMongo for a response from an insert if you don't set a timeout? ==> Immediate error

## Read Preference
* Primary is default
* Read from Secondaries ==> __Eventually__ consistent
* Closest node (15ms)
* If your write traffic is great enough, and your secondary is less powerful than the primary, you may overwhelm the secondary, which must process all the writes as well as the reads. Replication lag can result.
* You may not read what you previously wrote to MongoDB on a secondary because it will lag behind by some amount.
* If the secondary hardware has insufficient memory to keep the read working set in memory, directing reads to it will likely slow it down.

### ~~Reading from a secondary prevents it from being promoted to primary~~. .
* Reading from a secondary does not directly affect a secondary's ability to become primary, though if the reads caused it to lag on writes and fall behind on the oplog, that might make it ineligible until it is able to catch up. Here's a note on replication lag.
### If the secondary hardware has insufficient memory to keep the read working set in memory, directing reads to it will likely slow it down. 
* This could really go either way. If the secondary has excess capacity, beyond what it needs to take writes, then directing reads to it would cause it to work more, but perhaps it would still be able to keep up with the oplog. On the other hand, if the primary is taking writes faster than the secondary can keep up, then this scenario would definitely slow it down.
* Generally, your secondary should be on the same hardware as your primary, so if that's the case, and your primary would be able to keep up with the reads, then this shouldn't be a problem. Of course, if your primary can handle both the read and write loads, then there's really no compelling reason to send the reads to the secondary.
### If your write traffic is great enough, and your secondary is less powerful than the primary, you may overwhelm the secondary, which must process all the writes as well as the reads. Replication lag can result.
* This is a design anti-pattern that we sometimes see.
* A similar anti-pattern occurs when reads are routed to the primary, but the secondary is underpowered and unable to handle the full read + write load. In this case, if the secondary becomes primary, it will be unable to fulfill its job.
### You may not read what you previously wrote to MongoDB on a secondary because it will lag behind by some amount.
* This is pretty straightforward. Unless you are reading from the primary, the secondary will not necessarily have the most current version of the documents you need to read.
* Whether this is a problem or not depends on your application's requirements and business concerns, so it goes a bit outside the scope of development.


## Sharding
* Scaling Out
* MongoS ==> Router 
* Range-Based approach to distributing data across shard ==> shard_key (Old Fashined)
* hash-based approach offers more event distribued of data 
* Multi-mongoS
* 3 shard @ 3 replica set ==> 9 mongod + 3 mongod Config + mongos
```javascript
sh.status()
```

## Implication of Sharding
* Every document includes the shard Key
* Immutable ==> non modifiable 
* Les index unique doivent être associé à la shard key

## Choosing Shard Key
* Sufficient cardinality
* Choosing username as the shard key will distribute posts to the wall well across the shards.
* ~~No array~~
* Choosing visible_to as a shard key is illegal.
* ~~No BSON_ID~~ ==>Only increasing
* ~~No date~~ ==> Only increasing
* Choosing posttime as the shard key  will cause hotspotting as time progresses.
* {id, date, vendor} ==> {vendor, id}