const express = require('express'); //imports express module locally
const morgan = require('morgan'); //imports Morgan for logging
const bodyParser = require('body-parser'); 

const app = express(); // configure webs server + route HTTP requests and responses

app.use(morgan('common')); //invokes middleware function
app.use(express.static('public')); //serving static files
app.use(bodyParser.json());

let movies = [
      {
        title: 'Adams Apples',
        year: '2015',
        genre: {
          name: 'Black comedy',
          description: ''
        },
        director: {
          name: 'Anders Thomas Jensen',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'I care a lot',
        year: '2020',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'Parasite',
        year: '2019',
        genre: {
          name: 'Drama',
          description: 'This is a very long text about the genre of Drama'
        },
        director: {
          name: 'Bong Joon-ho',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'One Flew Over the Cuckoos Nest',
        year: '1975',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'Truman Show',
        year: '1998',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'What we do in the shadows',
        year: '2014',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'A Man Called Ove',
        year: '2015',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'Jojo Rabbit',
        year: '2019',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'Her',
        year: '2013',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      },
      {
        title: 'Drive',
        year: '2011',
        genre: {
          name: 'x',
          description: ''
        },
        director: {
          name: 'x',
          birthyear:'',
          deathyear:'',
          bio: '', 
          work: ''
        },
        imgURL: '',
        actors: ''
      }
  ];


app.get('/', (req, res) => {
    res.send('Welcome to my incredible MOVIE APP');
});


//Return a list of ALL movies
//GET  	/movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

//Return data about movie by title
//GET /movies/[title]
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movies) => 
  { return movies.title === req.params.title }));
});

//Return data about a genre (description) by name
//GET /movies/genres/[name]
app.get('/movies/genres/:name', (req, res) => {
  let genre = movies.find((genre) => { return genre.name === req.params.name});
  res.json(movies.find((genre) => 
  { return genre.description === req.params.description }));
});

//Return data about a director (bio, birth year, death year, work) by name
//GET  /movies/[director]/[name]
app.get('/movies/directors/:name', (req, res) => {
  res.json(director.find((director) => 
  { return director.name === req.params.name }));
});

//Allow new users to register     
//POST  /users
app.post('/users', (req, res) => {
  //to be added
  res.send('JSON object containing user data that was just added')
});

//Allow users to update their user info (username)   
//PUT /users/[username]
app.put('/users/:username', (req, res) => {
  //to be added
  res.send('Successful PUT request returning JSON object containing user data that was just updated');
});

//Allow users to add a movie to their list of favorites    
//POST /users/[username]/favorites
app.post('/users/:username/favorites', (req, res) => {
  //to be added
  res.send('JSON object containing movie data that was just added');
});

//Allow users to remove a movie from their list of favorites   	
//DELETE	/users/[username]/favorites
app.delete('/users/:username/favorites', (req, res) => {
  //to be added
  res.send('text message saying the movie was successfully deleted');
});

//Allow existing users to deregister    
//DELETE	/users/[username]
app.delete('/users/:username', (req, res) => {
  //to be added
  res.send('text message saying the account was successfully deleted');
});



// Error catch all
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
