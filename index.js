//Setup
const express = require('express'),
    morgan = require('morgan');
const app = express();

app.use(express.static('public'));
app.use(morgan('common'));


//Array with 10 objects containing movie info
let topMovies = [
    {
        title: 'Dune',
        director: 'Denis Villeneuve'
    },
    {
        title: 'The Thing',
        director: 'John Carpenter'
    },
    {
        title: '2001: A Space Odyssey',
        director: 'Stanley Kubrick'
    },
    {
        title: 'Fateful Findings',
        director: 'Neil Breen'
    },
    {
        title: 'What We Do in the Shadows',
        director: 'Jemaine Clement, Taika Waititi'
    },
    {
        title: 'Tim and Eric\'s Billion Dollar Movie',
        director: 'Tim Heidecker, Eric Wareheim'
    },
    {
        title: 'Hereditary',
        director: 'Ari Aster'
    },
    {
        title: 'November',
        director: 'Rainer Sarnet'
    },
    {
        title: 'The Wailing',
        director: 'Na Hong-jin'
    },
    {
        title: 'Mother!',
        director: 'Darren Aronofsky'
    }
];

// Express get route ENDPOINT: '/movies'
app.get('/movies', (req, res) => {
    res.json(topMovies);
    console.log('/movies page')
});

//Express get route ENDPOINT: '/'
app.get('/', (req, res) => {
    res.send('Welcome to the platform! Check out some cool movies!');
    console.log('main page')
});

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh... Something broke!');
});

//Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.')
});

