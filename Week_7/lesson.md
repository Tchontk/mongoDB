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
