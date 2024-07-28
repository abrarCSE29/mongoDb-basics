var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const password = "LMQR923C6hfLyS6q";
const uri = `mongodb+srv://jucse293981:${password}@cluster0.rkkhvmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    await client.connect();
    await client.db("myDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const myDatabase = client.db("myDatabase");
    const products = myDatabase.collection("products");

    app.post("/addNewProduct", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      try {
        await products.insertOne(newProduct);
        res.status(201).json({ message: "Product added successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add product");
      }
    });

    app.get("/products", async (req, res) => {
      try {
        const cursor = products.find();
        const results = await cursor.toArray();
        res.send(results);
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to retrieve products");
      }
    });

    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const cursor = products.find({_id : new ObjectId(id)});
        const results = await cursor.toArray();
        res.send(results[0]);
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to retrieve products");
      }
    });

   

    app.delete(`/deleteProduct/:id`, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      try {
        await products.deleteOne({ _id: new ObjectId(id) });
        res.json({message: "Product deleted successfully"});
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete product");
      }
    });

    app.put(`/updateProduct`, async (req, res) => {
      const id = req.body._id;
      const updatedProduct = req.body;
      console.log(updatedProduct.name);
      try {
        await products.updateOne({ _id: new ObjectId(id) }, { $set: {name : updatedProduct.name, pricePerKg : updatedProduct.pricePerKg, available : updatedProduct.available}});
        res.json({ message: "Product updated successfully"+updatedProduct.name });
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update product");
      }
    });

  } catch (error) {
    console.error(error);
  } 
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(4200, () => {
  console.log("Listening on port 4200");
});
