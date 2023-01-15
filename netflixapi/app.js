let express = require('express');
let app = express();
let port=1000;
let cors=require('cors')
let mongo =require('mongodb');
let MongoClient=mongo.MongoClient;
let mongoUrl="mongodb://localhost:27017";
let db;

//middleware
app.use(cors())


app.get('/', (req, res) =>{
    res.send("<h1>hello from express</h1>");
})



// list of category api
app.get('/category',(req,res) => {
    db.collection('category').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
 })



//  list of records api
 app.get('/records',(req,res) => {
    let query={}
    let categoryId = Number(req.query.categoryId);
    
    
    //  records wrt category api
    if(categoryId)
    {
        query={category_id:categoryId}
    }

    db.collection('records').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
 })





 app.get('/filters/:categoryId',(req,res) => {
    let query = {};
    let categoryId= Number(req.params.categoryId);
    let movieType = req.query.movieType;
    let rating = Number(req.query.rating);
    let lrating = Number(req.query.lrating);
    let hrating = Number(req.query.hrating);

    // filter on basis of category + movieType api
    if(movieType)
    {
        query={
            category_id:categoryId,
            movie_type:movieType
        }
    }

    // filter on basis of category + rating api
    else if(lrating && hrating)
    {
       query={
            category_id:categoryId,
           $and:[{rating:{$gt:lrating,$lt:hrating}}]
        }
    }
    
    db.collection('records').find(query).toArray((err,result) => {
       if(err) throw err;
       res.send(result)
   })
})



// detail of category api
app.get('/details/:categoryId',(req,res) => {
    //let id = mongo.ObjectId(req.params.restId)
    let categoryId = Number(req.params.categoryId)
    db.collection('records').find({category_id:categoryId}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
 



// connect with mongodb
MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,dc) => {
    if(err) console.log('Error while connecting');
    db = dc.db('netflixdatabase');
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`)
    })
})