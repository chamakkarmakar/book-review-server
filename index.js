require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pm0abs7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const bookDB = client.db("bookDB");
        const reviewsCollection = bookDB.collection("reviewsCollection");

        // get all data 
        app.get("/books", async (req, res) => {
            const booksData = reviewsCollection.find();
            const result = await booksData.toArray();
            res.send(result);
        });

        // create data 
        app.post("/books", async (req, res) => {
            const booksData = req.body;
            const result = await reviewsCollection.insertOne(booksData);
            res.send(result);
        });

        // update data 
        app.patch("/books/:id", async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await reviewsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: updatedData }
            );
            res.send(result);
          });

        //   delete data
        app.delete("/books/:id",  async (req, res) => {
            const id = req.params.id;
            const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
          });

        console.log("Database is connected");
    } finally {

        await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Route is working");
});

app.listen(port, (req, res) => {
    console.log("App is listening on port :", port);
});




// chamak56
// 6LbTAqYbnJy2zshQ