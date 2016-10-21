/**
 * Suppose you wish to 
 * update the value of the "plot" field 
 * for one document in our "movieDetails" collection 
 * to correct a typo. 
 * Which of the following update operators and modifiers would you need to use to do this?
 */
// Update ou Insert
db.movieDetails.updateOne({
  title: "bloblo"
}, {
  $set: {
    plot: "blabla"
  }
})