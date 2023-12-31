const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use(cors());
app.use(express());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zlgqora.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("assignment11").collection("toys");
    const addedCollection = client.db("assignment11").collection("addedToy");

    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.get("/toy", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await addedCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/toy", async (req, res) => {
      const addtoy = req.body;
      const result = await addedCollection.insertOne(addtoy);
      res.send(result);
    });

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedCollection.findOne(query);
      res.send(result);
    });

    app.put("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updatedToy = req.body;
      const options = { upsert: true };
      const updateToy = {
        $set: {
          name: updatedToy.name,

          email: updatedToy.email,
          toyName: updatedToy.toyName,
          image: updatedToy.image,
          category: updatedToy.category,
          quantity: updatedToy.quantity,
          price: updatedToy.price,
        },
      };
      const result = await addedCollection.updateOne(
        filter,
        updateToy,
        options
      );
      res.send(result);
    });

    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedCollection.deleteOne(query);
      res.send(result);
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ToyTopia server side is runnig");
});

app.listen(port, () => {
  console.log(`running or port ${port}`);
});
