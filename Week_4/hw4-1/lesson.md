## 1-1 Relation
### Par défaut __Embedding__
### Pourquoi séparer en deux collections (__Linking__)
* Fréquence d'accès élevée à une des collections et faible pour la seconde (_si gros volume_)
* Croissance : La croissance d'une des collections est régulière pas rapport à la seconde qui elle est stable
* Taille : La taille cummulée des documents tendant à dépasser 16 MB
* Atomicité : Pas de maj d'informations des deux collection en même temps

## 1-n Relation
### Many --> __Linking__
* 2 Collections
* La collection Many (People) porte l'id du "1" (City) 
### Few --> __Embedding__
* 1 Collection
* Embed le Few (Comment) dans le "1" (Post)

## Many - Many
### 2 collections --> __Linking__
* Une table d'id dans une des collections 
* Une table d'id dans les deux collections ==> Pour un problème de performance, mais bof --> Inconsistance

### 1 Collections --> __Embedding__
* Embed une dans l'autre ==> Bof duplication.... --> Inconsistance
