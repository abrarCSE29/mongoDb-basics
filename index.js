var express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const password = 'LMQR923C6hfLyS6q'


const uri = "mongodb+srv://jucse293981:LMQR923C6hfLyS6q@cluster0.rkkhvmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var app = express();

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
      // Send a ping to confirm a successful connection
      await client.db("myDatabase").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      product = {name : "Mango", pricePerKg : 230, available : 100}

      const myDatabase = client.db("myDatabase");
      const products = myDatabase.collection("products");
      await products.insertOne(product)
      .then(console.log("one product added"))
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello World!");
});
app.listen(4200, () =>{console.log("listing in port 4200")});