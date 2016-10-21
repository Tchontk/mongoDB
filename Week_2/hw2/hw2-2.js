/**
 * Using the video.movieDetails collection, 
 * which of the queries below would produce output documents that resemble the following
 */
/**
 * { "title" : "P.S. I Love You" }
 * { "title" : "Love Actually" }
 * { "title" : "Shakespeare in Love" }
 */
dbo.movieDetails.find({}, {
    title: 1,
    _id: 0
  })
  // Il faut spécifier le "_id:0"