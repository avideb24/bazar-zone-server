const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 4000;
require('dotenv').config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.em2vhup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const productCollection = client.db("Bazar-Zone").collection('products');


    // add product
    app.post('/products', async(req,res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    // get all products
    app.get('/products', async(req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    })

    // get single product
    app.get('/products/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // get products by category
    app.get('/products/category/:category', async(req, res) => {
      const category = req.params.category;
      if(category){
        const query = {category: category};
        const result = await productCollection.find(query).toArray();
        res.send(result)
      }
      
    })

    // search products
    app.get('/products/search/:name', async(req, res) => {
      const productName = req.params.name;
      const query = {title: { $regex: productName, $options:'i' }};
      const result = await productCollection.find(query).toArray();
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


app.get('/', (req, res) => {
    res.send('Bazar-Zone server is running...')
})

app.listen(port, () => {
    console.log("Port:", port);
})