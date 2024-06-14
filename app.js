const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require('mongodb');

const path = require('path');

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const mongoUrl = "mongodb://localhost:27017";
const dbName = "movies";
let db;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
  });
  app.get('/home', async (req, res) => {
    try {
      const movies = await db.collection('movieDetails').find().toArray();
      res.render('home', { movies });
    } catch (err) {
      console.error('Error fetching movies:', err);
      res.status(500).send('Failed to fetch movies');
    }
  });
  
  app.get('/addMovie', (req, res) => {
    res.render('addMovie');
  });
 
  app.post('/addMovie', async (req, res) => {
    const movie = {
      mname: req.body.mname,
      director: req.body.director,
      genre: req.body.genre,
      language: req.body.language,
      rating: parseInt(req.body.rating),
      review: req.body.review,
      image: req.body.image,
      trailer: req.body.trailer,
      isLatest: req.body.isLatest === 'on' // Checkbox for marking as latest
    };
    
    try {
      const result = await db.collection('movieDetails').insertOne(movie);
      console.log('Movie inserted:', result.insertedId);
      res.redirect('/');
    } catch (err) {
      console.error('Error inserting movie:', err);
      res.status(500).send('Failed to insert movie');
    }
  });
  
  app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;
  
    try {
      const movie = await db.collection('movieDetails').findOne({ _id: new ObjectId(movieId) });
      if (movie) {
        res.render('movie', { movie });
      } else {
        res.status(404).send('Movie not found');
      }
    } catch (err) {
      console.error('Error fetching movie:', err);
      res.status(500).send('Failed to fetch movie');
    }
  });
  
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.post("/signup", async (req, res) => {
  const { name, email } = req.body;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    const existingUser = await db.collection("users").findOne({ name, email });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }
    await db.collection("users").insertOne({ name, email });
    res.redirect("/");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send("Failed to insert data");
  }
});

app.post("/login", async (req, res) => {
  const { name, email } = req.body;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    const user = await db.collection("users").findOne({ name, email });
    if (user) {
      res.redirect("/home");
    } else {
      res.status(401).send("User name or email not found");
    }
  } catch (err) {
    console.error("Error querying data:", err);
    res.status(500).send("Failed to query data");
  }
});


app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    const items = await db.collection("items").find({ mname: { $regex: query, $options: 'i' } }).toArray();
    res.json(items);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Failed to fetch data");
  }
});
app.get("/insert", (req, res) => {
  res.sendFile(__dirname + "/insert.html");
});

app.post("/insert", async (req, res) => {
  const { name, email, mname, director, rating, review } = req.body;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    await db.collection("items").insertOne({ name, email, mname, director, rating, review});
    res.redirect("/home");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send("Failed to insert data");
  }
});

app.get("/update", async (req, res) => {
  res.sendFile(__dirname + "/update.html");
});

app.post("/update", async (req, res) => {
  const { name, email, mname, director, rating, review } = req.body;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    await db.collection("items").updateOne(
      { name, email },
      {
        $set: {
          mname,
          director,
          rating,
          review
        }
      }
    );
    console.log("1 document updated");
    res.redirect("/home");
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).send("Failed to update data");
  }
});

app.get("/delete", async (req, res) => {
  res.sendFile(__dirname + "/delete.html");
});

app.post("/delete", async (req, res) => {
  const { name, email, mname, director } = req.body;
  try {
    await db.collection("items").deleteOne({ name, email, mname, director });
    console.log("1 document deleted");
    res.redirect("/home");
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("Failed to delete data");
  }
});
app.get("/movie/:mname", async (req, res) => {
  const mname = req.params.mname;
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    const movie = await db.collection("items").findOne({ mname });
    if (movie) {
      res.render("movie", { movie });
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Failed to fetch data");
  }
});

app.get("/report", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not initialized");
    return;
  }
  try {
    const items = await db.collection("items").find().toArray();
    let tableContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Report Page</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
        .navbar {
          background-color: #343a40 !important;
      }

      .navbar-light .navbar-nav .nav-link {
          color: #e0e0e0 !important;
      }
          .navbar-nav{
            margin-left:487px;
        }
      .navbar-light .navbar-nav .nav-link:hover {
          color: #f0f0f0 !important;
      }
        </style>
        </head>
      <body style='background-color:black; color: goldenrod;'>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" style="color:goldenrod" href="#">Movie Review System</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/home">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/addMovie">Add Movie</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/insert">Add Review</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/update">Update Review</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/delete">Delete Review</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/report">Generate Report</a>
                </li>
            </ul>
        </div>
      </nav>
      <div class="container mt-5">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th style="color:red">Name</th>
              <th style="color:red">Email</th>
              <th style="color:red">Movie Name</th>
              <th style="color:red">Director</th>
              <th style="color:red">Rating</th>
              <th style="color:red">Review</th>
            </tr>
          </thead>
          <tbody>`;
    items.forEach(item => {
      tableContent += `
            <tr>
              <td style="color:goldenrod">${item.name}</td>
              <td style="color:goldenrod">${item.email}</td>
              <td style="color:goldenrod">${item.mname}</td>
              <td style="color:goldenrod">${item.director}</td>
              <td style="color:goldenrod">${item.rating}</td>
              <td style="color:goldenrod">${item.review}</td>
            </tr>`;
    });
    tableContent += `
          </tbody>
        </table>
      </div>
      </body>
      </html>`;
    res.send(tableContent);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Failed to fetch data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
