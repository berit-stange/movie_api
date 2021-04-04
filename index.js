const express = require('express'); //imports express module locally
const morgan = require('morgan'); //imports Morgan for logging
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });


const app = express(); // configure webs server + route HTTP requests and responses

app.use(morgan('common')); //invokes middleware function
app.use(express.static('public')); //serving static files
app.use(bodyParser.json());

let auth = require('./auth')(app); //import “auth.js” file
const passport = require('passport'); //require the Passport module
require('./passport'); //import the “passport.js” file


app.get('/', (req, res) => {
    res.send('Welcome to my incredible MOVIE APP');
});


//1. Return a list of ALL movies --- //GET /movies
app.get('/movies', passport.authenticate('jwt', { session: false }),
(req, res) => {
    Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});


//2. Return data about movie by title --- //GET /movies/[title]
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//3. Return data about a genre (description) by name --- //GET /movies/genres/[name]
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }),
(req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//4. Return data about a director (bio, birth year, death year, work) by name --- //GET  /movies/[director]/[name]
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }),
(req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//Get all users --- only for internal use 
app.get('/users', passport.authenticate('jwt', { session: false }),
(req,res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error ' + err);
  });
});

//Get user by username  --- only for internal use
app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//5. Allow new users to register --- //POST  /users
app.post('/users',
(req, res) => {
  Users.findOne({ Username: req.body.Username })//check if a user with the username provided by the client already exists
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{res.status(201).json(user)})
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//6. Allow users to update their user info (username) --- //PUT /users/[username]
app.put('/users/:Username', 
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, //makes sure updated info is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//7. Allow users to add a movie to their list of favorites --- //POST /users/[username]/favorites
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//8. Allow users to remove a movie from their list of favorites --- //DELETE	/users/[username]/favorites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedFavs) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedFavs);
   }
 });
});

//9. Allow existing users to deregister --- //DELETE	/users/[username]
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
 });



// Error catch all
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
