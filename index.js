var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require('multer');

const { MongoClient, ServerApiVersion } = require("mongodb");

const password = "LMQR923C6hfLyS6q";
const uri = `mongodb+srv://jucse293981:${password}@cluster0.rkkhvmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

var app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
var upload = multer();
app.use(upload.array()); 
app.use(express.static('public'));


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("myDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const myDatabase = client.db("myDatabase");
    const products = myDatabase.collection("products");

    app.post("/addNewProduct", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      try {
        await products.insertOne(newProduct);
        res.status(201).send("Product added successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add product");
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();  // Commented out to keep the connection open
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(4200, () => {
  console.log("Listening on port 4200");
});
