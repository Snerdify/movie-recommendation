const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/movie_recommendation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    });

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {  
    try {
        const { username, password } = req.body;
        const user = await User .findOne({ username }); 
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, 'secret'); 
            res.json({ message: 'Login successful', token });
        }
        else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
         // create jwt token

        const token = jwt.sign({userId : user_id , username : username}, 'secret_key' , {expiresIn : '1h'});
        console.log(token);

    res.json({token }) ;
    } catch (err) { 
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Error logging in' });
    }   
   
});




// endpoint for user movie ratings

app.post('/api/rating', async (req, res) => {
    try{
        const{userId, movieId, rating} = req.body;  
        const newRating = new Rating({userId, movieId, rating});
        await newRating.save();
        res.status(201).json({message: 'Rating added successfully'});
    } catch(err){
        console.error('Error adding rating:', err);
        res.status(500).json({error: 'Error adding rating'});
    } });

// endpoint for movie recommendations for users


app.get('/api/recommendations/:userId', async (req, res) => {
    try{
        const userId = parseInt(req.params.userId);
        const userRatings = await Rating.find({userId});
        const movieIds = userRatings.map(rating => rating.movieId);
        const movieRecommendation = new MovieRecommendation(userRatings);
        const recommendations = await Movie.find({_id: {$nin: movieIds}});
        res.json(recommendations);
    } catch (error){
        console.error('Error fetching recommendations:', error);
        res.status(500).json({error: 'Error fetching recommendations'});
    }
});




    app.listen(port, () => {    
        console.log(`Server running on port ${port}`);
    });
