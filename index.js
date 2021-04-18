const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PROT || 8181;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyi6m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))





app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+"/index.html"));
})




client.connect(err => {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION1);
    const collection2 = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION2);

    app.post('/addProduct', (req, res) => {
    
        let product = req.body;
        

        if(product){
            collection.insertOne(product)
            .then(result => {
                console.log("one product inserted");
                product = null;
                res.send("one product inserted")
            })
            .catch(e => console.log(e.message))
        }
    })

    app.get('/products', (req, res) => {
        collection.find({}).toArray((err, products) => {
            res.send(products);
        })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        collection.deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                res.send(result.deletedCount>0?"deleted one product":"not deleted");
            })
            .catch(e => console.log(e.message))
    })






    app.post('/orders/', (req, res) => {
        let order = req.body;
        if(order){
            collection2.insertOne(order)
                .then(result => {
                    console.log("one order placed");
                    order = null;
                    res.send("one order placed")
                })
                .catch(e => console.log(e.message))
        }
    })



    app.get('/orders/:email', (req, res) => {
        collection2.find({email: req.params.email}).toArray((err, orders) => {
            res.send(orders);
        })
    })


    app.delete('/order/:id', (req, res) => {
        collection2.deleteOne({_id: req.params.id})
            .then(result => {
                res.send(result.deletedCount>0?"deleted one product":"not deleted");
            })
            .catch(e => console.log(e.message))
    })
    
});



app.listen(port, () => {
    console.log(`Bengali Bazer running on ${port} port`)
})