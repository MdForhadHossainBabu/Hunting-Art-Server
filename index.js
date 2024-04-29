const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors())
app.use(express.json());



// mongodb uri


const uri =
  `mongodb+srv://${process.env.ART_USER}:${process.env.ART_PASS}@cluster0.tekyyoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
   
    const craftCollection = client.db('CraftDB').collection('craft');
    const userCollection = client.db('CraftDB').collection('user');
    const myCraftCollection = client.db('MyCraftDB').collection('MyCraft')

   app.post('/craft', async (req, res) => {
    const newCraft = req.body;
    console.log(newCraft);
    const result = await craftCollection.insertOne(newCraft);
    res.send(result)
   })
   
   
   app.get('/craft', async (req, res) => {
    const cursor = await craftCollection.find().toArray();
    res.send(cursor)
   })
 

   app.get('/craft/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await craftCollection.findOne(query);
    res.send(result);
   })
   
    
    // user related apis
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    app.get('/user', async (req, res) => {
      const cursor = await userCollection.find().toArray();
      res.send(cursor);
    })
    app.post('/craftItem', async (req, res) => {
      const id = req.body;
      console.log(id);
      const result = await myCraftCollection.insertOne(id);
      res.send(result)
    })
    app.get('/craftItem', async (req, res) => {
      const cursor = await myCraftCollection.find().toArray();
      res.send(cursor)
    })

    app.get('/craftItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCraftCollection.findOne(query);
      res.send(result)
    })

    app.put('/craftItem/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const Craft = {
        $set: {
          craftName: updatedCraft.craftName,
          quantity: updatedCraft.quantity,
          rating: updatedCraft.rating,
          price: updatedCraft.price,
          description: updatedCraft.description,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
          userName: updatedCraft.userName,
          email: updatedCraft.email,
          category: updatedCraft.category,
          photo: updatedCraft.photo,
        },
      };
      const result = await myCraftCollection.updateOne(filter, Craft, options);
      res.send(result)
    })

    app.delete('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCraftCollection.deleteOne(query);
      res.send(result);
    })
   

    
    app.get('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCraftCollection.findOne(query);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb uri end

app.get('/', (req, res) => {
 res.send('Art & Craft is running server')
});

app.listen(port, () => {
 console.log(`Art & Craft is running Now on server : ${port}`);
})