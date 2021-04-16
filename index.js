const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
require('dotenv').config();
const port = process.env.PORT || 5700


app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
    res.send(` Hello Rahul Mohonto Welcome to port ${port}`)
});



var serviceAccount = require("./configs/bus-client-assignment-firebase-adminsdk-j6nyr-995ac668c0.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bus-client-assignment.firebaseio.com"
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adxso.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("full-stack-assignment-database").collection("services");
    const reviewCollection = client.db("full-stack-assignment-database").collection("reviews");
    console.log("database connected successfully");

    app.post('/addServices', (req, res) => {
        const newService = req.body;
        console.log(newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount)
            })
    })

    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addReviews', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount)
            })
    })
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

})





app.listen(port, () => {
    console.log(`Welcome rahul Mohonto at port http://localhost:${port}`)
})