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
    const orderCollection = client.db("full-stack-assignment-database").collection("orders");

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

    app.post('/orders', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount)
            })
        console.log(newOrder)
    })


    app.get('/allOrders/:id', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/orderById/:id', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.get('/showOrders', (req, res) => {
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            // console.log({ idToken })
            admin
                .auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    if (tokenEmail == queryEmail) {
                        orderCollection.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents)
                                console.log(err)
                            })
                    }
                    // else {
                    //     res.status(401).send('Un-authorized Access')
                    // }
                    console.log({ tokenEmail })
                })
                .catch((error) => {
                    console.log(error)
                    res.status(401).send('Un-authorized Access')
                });
        }
        else {
            res.status(401).send('Un-authorized Access')
        }

    })


    app.delete('/deleteService/:id', (req, res) => {
        const id = objectId(req.params.id);
        console.log('delete this product', id)
        serviceCollection.findOneAndDelete({ _id: id })
            .then(result => {
                res.send(result.deletedCount > 0)
                console.log(result)
            })
            .catch(err => console.error(`Failed to find and delete document: ${err}`))

    })



})





app.listen(port, () => {
    console.log(`Welcome rahul Mohonto at port http://localhost:${port}`)
})