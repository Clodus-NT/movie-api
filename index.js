//Setup
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');



app.use(bodyParser.json());
app.use(morgan('common'));

let users = [
    {
        id: 1,
        name: 'Nick',
        favoriteMovies: ['2001: A Space Odyssey']
    },
    {
        id: 2,
        name: 'Chelsea',
        favoriteMovies: []
    }
];

// //Array with 5 objects containing movie info
let movies = [
    {
        title: 'Dune',
        description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
        genre: {
          name: 'Science-Fiction',
          description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
          name: 'Denis Villeneuve',
          bio: 'Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started his career as a filmmaker at the National Film Board of Canada. He is best known for his feature films Arrival (2016), Sicario (2015), Prisoners (2013), Enemy (2013), and Incendies (2010).',
          birth: '1967'
        }
    },
    {
        title: '2001: A Space Odyssey',
        description: 'The Monoliths push humanity to reach for the stars; after their discovery in Africa generations ago, the mysterious objects lead mankind on an awesome journey to Jupiter, with the help of H.A.L. 9000: the world\'s greatest supercomputer.',
        genre: {
            name: 'Science-Fiction',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel or other technologies.',
        },
        director: {
            name: 'Stanley Kubrick',
            bio: 'Stanley Kubrick was an American filmmaker known for directing such acclaimed features as "Dr. Strangelove" and "A Clockwork Orange".',
            birth: '1928'
        }
    },
    {
        title: 'November',
        description: 'In a poor Estonian village, a group of peasants use magic and folk remedies to survive the winter, and a young woman tries to get a young man to love her.',
        genre: {
            name: 'Horror',
            description: 'Horror is a genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences. The key focus of a horror novel, horror film, or horror TV show is to elicit a sense of dread in the reader through frightening images, themes, and situations.',
        },
        director: {
            name: 'Rainer Sarnet',
            bio: 'Rainer is an Estonian film director known for works such as "November" and "The Idiot".',
            birth: '1969'
        }
    },
    {
        title: 'Fateful Findings',
        description: 'A computer-scientist/novelist reunites with his childhood friend, hacks into government databases, and faces the dire and fateful consequences of the mystical actions he obtained as a child.',
        genre: {
            name: 'Drama',
            description: 'The drama genre features stories with high stakes and a lot of conflicts. They\'re plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real life scenarios or extreme situations with emotionally driven characters.'
        },
        director: {
            name: 'Neil Breen',
            bio: 'Breen\'s movies tend to have a supernatural nature where the protagonist (always portrayed by himself) is a messianic being who stands up for the greater good by confronting harmful people and powerful / corrupt institutions. This moral protector of the innocent people wants to clean the earth from all evil and wrongdoing. Despite that, Neil Breen\'s films are generally perceived as very bad and amateurish features due to their poor production value, bad writing, acting and editing. It\'s very likely Breen gained a lot of fame due to this perception.',
            birth: '1958'
        }
    },
    {
        title: 'Eraserhead',
        description: 'Henry Spencer tries to survive his industrial environment, his angry girlfriend, and the unbearable screams of his newly born mutant child.',
        genre: {
            name: 'Horror',
            description: 'Horror is a genre of literature, film, and television that is meant to scare, startle, shock, and even repulse audiences. The key focus of a horror novel, horror film, or horror TV show is to elicit a sense of dread in the reader through frightening images, themes, and situations.',
        },
        director: {
            name: 'David Lynch',
            bio: 'David Lynch is an American film director known for his surrealist take on film and television.',
            birth: '1946'
        }
    }   
]

//Create (new user)
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names');
    }
});

//Update (user name)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

//Create (fav movie)
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    }else {
        res.status(400).send('no such user');
    }
});

//Delete (fav movie)
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    }else {
        res.status(400).send('no such user');
    }
});

//Delete (user)
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    }else {
        res.status(400).send('user deletion failed');
    }
});

//Read (all movies)
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

//Read (single movie)
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    };
});

//Read (genre)
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    };
});

//Read (director)
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    };
});

//Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.')
});

