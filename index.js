const express = require('express'); //imports express module locally
const morgan = require('morgan'); //imports Morgan middleware for logging
const bodyParser = require('body-parser'); //Body parser for JSON Objects
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });

const { check, validationResult } = require('express-validator');
const app = express(); // configure webs server + route HTTP requests and responses

app.use(morgan('common')); //invokes middleware function
app.use(express.static('public')); //serving static files
app.use(bodyParser.json());

const cors = require('cors'); //allows all domains to make requests
// app.use(cors());
let allowedOrigins = ["http://localhost:8080', http://localhost:5500','https://mymovies-app.netlify.app/"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app); //import “auth.js” file
const passport = require('passport'); //require the Passport module
require('./passport'); //import the “passport.js” file


app.get('/', (req, res) => {
  res.send('Welcome to my movieApp');
});


/** @function
 * @name getMovies
 * @description 1. Return a list of ALL movies --- //GET /movies
 * @returns {json} array of all movie objects from database
 */
app.get('/movies',
  passport.authenticate('jwt', { session: false }),
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

/** @function
 * @name getMovie
 * @description  Return data about movie by title --- //GET /movies/[title]
 * @param {string} id - The movie's ID
 * @returns {json} movie - movie object from database
 */
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

/** @function
 * @name getGenre
 * @description 3. Return data about a genre (description) by name --- //GET /movies/genres/[name]
 * @returns {json} movie.Genre - genre data from database
 */
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

/** @function
 * @name getDirector
 * @description 4. Return data about a director (bio, birth year, death year, work) by name --- //GET  /movies/[director]/[name]
 * @returns {json} movie.Director - director object from database
 */
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

/** @function
 * @name registerUser
 * @description 5. Allow new users to register --- //POST  /users
 * @param {object} - New user registration data
 * @returns {json} user object - new registered user's data
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
    check('Birthday', 'Birthday must be a date').isDate()  //{ format: 'YYYY-MM-DD'}
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })//check if a user with the username provided by the client already exists
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword, //variable that refers to function in models.js
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/** @function
 * @name getUser
 * @description 6. Get user by username  --- //GET /users/[username]
 * @param {string} Username - The user's username
 * @returns {json} user object - specific user from database
 */
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

/** @function
 * @name updateUser
 * @description 7. Allow users to update their user info (username) --- //PUT /users/[username]
 * @param {object} - New updated user data
 * @param {string} Username - The user's username
 * @returns {json} user object - updated user data
 */
app.put('/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
    check('Birthday', 'Birthday must be a date').isDate() //{ format: 'YYYY-MM-DD'}
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }, //makes sure updated info is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

/** @function
 * @name addFavoriteMovie
 * @description 8. Allow users to add a movie to their list of favorites --- //POST /users/[username]/favorites
 * @param {string} Username - The user's username
 * @returns {json} user object
 */
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

/** @function
 * @name deleteFavorite
 * @description 9. Allow users to remove a movie from their list of favorites --- //DELETE	/users/[username]/favorites
 * @param {string} Username - The user's username
 * @returns {json} favorite movies object
 */
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

/** @function
 * @name deleteUser
 * @description 10. Allow existing users to deregister --- //DELETE	/users/[username]
 * @param {string} Username - The user's username
 * @returns {string} - confirmation of the user's deletion
 */
//10. Allow existing users to deregister --- //DELETE	/users/[username]
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


// app.listen(8080, () => {
//     console.log('Your app is listening on port 8080');
// });
const port = process.env.PORT || 5500;
// const port = process.env.PORT || 8080;
// const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});