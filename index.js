const express = require('express'); //imports express module locally
const morgan = require('morgan'); //imports Morgan for logging

const app = express(); // configure webs server + route HTTP requests and responses

app.use(morgan('common')); //invokes middleware function
app.use(express.static('public')); //serving static files

let topMovies = [
      {
        title: 'Adams Apples',
        year: '2015'
      },
      {
        title: 'I care a lot',
        year: '2020'
      },
      {
        title: 'Parasite',
        year: '2019'
      },
      {
        title: 'One Flew Over the Cuckoos Nest',
        year: '1975'
      },
      {
        title: 'Truman Show',
        year: '1998'
      },
      {
        title: 'What we do in the shadows',
        year: '2014'
      },
      {
        title: 'A Man Called Ove',
        year: '2015'
      },
      {
        title: 'Jojo Rabbit',
        year: '2019'
      },
      {
        title: 'Her',
        year: '2013'
      },
      {
        title: 'Drive',
        year: '2011'
      }
  ];


app.get('/', (req, res) => {
    res.send('Welcome to my incredible MOVIE APP');
});

app.get('/topmovies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
