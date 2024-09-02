const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
const app = express();

//db connection
app.use(express.json()); //without this req.body not works.req.body stores data we entered
var db;
connectToDb((err) => {
  if (!err) {
    db = getDb(); // Assign the database instance

    // Define routes only after the database connection is established
    //fetching all documents.
    app.get("/books", (req, res) => {
      db.collection("books")
        .find()
        .toArray() // Convert cursor to an array
        .then((books) => {
          res.status(200).json(books);
        })
        .catch((err) => {
          res.status(500).json({ error: "server error" });
        });
    });

    app.listen(3000, () => {
      console.log("server is running");
    });
  } else {
    console.error("Failed to connect to the database", err);
  }
});

//fetching single documents
app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((err) => {
        res.status(500).json({ error: "server error" });
      });
  } else {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((doc) => {
      res.status(201).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: "server error" });
    });
});

app.delete("/books", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "server error" });
      });
  } else {
    res.status(500).json({ error: "server error" });
  }
});

app.patch("/books", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updates({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "server error" });
      });
  } else {
    res.status(500).json({ error: "server error" });
  }
});
