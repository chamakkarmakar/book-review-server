require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.co1ibvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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