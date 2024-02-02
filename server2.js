const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const cors = require('cors');


const app = express();
const port =  process.env.PORT || 5000;
app.use(express.json());
app.use(cors());





const serviceAccount = require('./path to firebase account.json');
admin.initiliazeApp({
    credential : admin.credential.cert(serviceAccount),
    // databaseURL : 'https://fir-auth-1-1e3e7.firebaseio.com'
    });

mongoose.connect('mongodb://localhost:27017/movies', 
        {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection ; 

db.on('error' , console.error.bind(console, "Connection error"));

db.once ('open',()=>{
    console.log('Database connected');
});


// user_movie_ratings 

const Rating = mongoose.model('User_Rating', ratingSchema);

// define the endpoint for user movie ratings 

app.post('/api/rating' , async (req , res)=>{
    try{
        const {userId , movieId , rating} = req.body;
        const userRating = new Rating({movieId , rating});
        await userRating.save();
        res.json(userRating);
        res.status(201).json({message : "Rating added successfully"});
    }catch(err){ 
        console.error('Error saving rating :' , err);
        res.status(500).json({error : 'Internal Error: saving rating'});
    }
});


// endpoint for movie recommendations for users 

app.get('/api/recommendations/:userId' , async (req , res)=>{
    try{
        const userId = parseInt(req.params.userId);
        const userRatings = await Rating.find({userId});
        const movieIds = userRatings.map(rating => rating.movieId);
        const movieRecommendation = new MovieRecommendation(userRatings);
        const recommendations = await Movie.find({_id : {$nin : movieIds}});
        res.json(recommendations);
    } catch(err){
        console.error('Error fetching recommendations:', err);
        res.status(500).json({error : 'Internal Error: fetching recommendations'});
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

});
