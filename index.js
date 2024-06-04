require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
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

function createToken(user) {
    const token = jwt.sign(
        {
            email: user.email,
        },
        "secret",
        { expiresIn: "7d" }
    );
    return token;
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "secret");
    if (!verify?.email) {
        return res.send("You are not authorized");
    }
    req.user = verify.email;
    next();
}

async function run() {
    try {
        await client.connect();

        const bookDB = client.db("bookDB");
        const reviewsCollection = bookDB.collection("reviewsCollection");

        const userDB = client.db("userDB");
        const userCollection = userDB.collection("userCollection");

        // get all data 
        app.get("/books", async (req, res) => {
            const booksData = reviewsCollection.find();
            const result = await booksData.toArray();
            res.send(result);
        });

        // get single data
        app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
            const bookData = await reviewsCollection.findOne({
                _id: new ObjectId(id),
            });
            res.send(bookData);
        });

        // create data 
        app.post("/books", verifyToken, async (req, res) => {
            const booksData = req.body;
            const result = await reviewsCollection.insertOne(booksData);
            res.send(result);
        });

        // update data 
        app.patch("/books/:id", verifyToken,async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await reviewsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        });

        //   delete data
        app.delete("/books/:id", verifyToken,async (req, res) => {
            const id = req.params.id;
            const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });


        // create user 
        app.post("/user", async (req, res) => {
            const user = req.body;
            const token = createToken(user);
            console.log(token);
            const isUserExist = await userCollection.findOne({ email: user?.email });
            if (isUserExist?._id) {
                return res.send({
                    statu: "success",
                    message: "Successfully Login",
                    token
                });
            }
            await userCollection.insertOne(user);
            return res.send({ token });;
        });

        app.get("/user/get/:id", async (req, res) => {
            const id = req.params.id;
            const result = await userCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.findOne({ email });
            res.send(result);
        });

        app.patch("/user/:email", async (req, res) => {
            const email = req.params.email;
            const userData = req.body;
            const result = await userCollection.updateOne(
                { email },
                { $set: userData },
                { upsert: true }
            );
            res.send(result);
        });

        console.log("Database is connected");
    } finally {

        // await client.close();
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