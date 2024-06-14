const { MongoClient } = require('mongodb');

async function insertMovies() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('movies');
    const collection = database.collection('movieDetails');

    const movies = [
      {
        "mname": "Dasavatharam",
        "director": "K.S.Ravikumar",
        "genre": "Action, Adventure, Drama",
        "language": "Tamil",
        "rating": 4,
        "review": "This outstanding film explores Chaos theory and the science of Karma...",
        "image": "https://m.media-amazon.com/images/M/MV5BNTIwYWFlYjItMWM4Yy00ZjlmLWIyODQtYmFmMTYyZTc3MjRkXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_.jpg",
        "trailer": "https://www.youtube.com/watch?v=MAnKUX9w494"
      },
      {
        "mname": "Garudan",
        "director": "Arun",
        "genre": "Thriller",
        "language": "Malayalam",
        "rating": 5,
        "review": "A gripping thriller with excellent performances...",
        "image": "https://example.com/garudan.jpg",
        "trailer": "https://www.youtube.com/watch?v=example"
      }
      // Add more movies as needed
    ];

    const result = await collection.insertMany(movies);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

insertMovies().catch(console.dir);
