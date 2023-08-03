const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 7700;

//medddlewere 
app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send('voice server is running')
})

//connect to mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_HUNTER}:${process.env.DB_PASS}@cluster10.dn0f8be.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db('voiceHunterDB').collection('prooducts');
    const cartsCollection = client.db('voiceHunterDB').collection('carts');

    app.get("/products", async(req,res)=>{
        const result = await productsCollection.find().toArray();
        res.send(result);
    })

    app.post("/carts", async(req,res)=>{
      const item = req.body;
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`voice server is running on port : ${port}`)
})