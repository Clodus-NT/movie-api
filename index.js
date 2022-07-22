//Requires and Setup
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan'),
    req = require('express/lib/request'),
    mongoose = require('mongoose'),
    Models = require('./models.js');
const {check, validationResult} = require('express-validator');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors = require('cors');
let allowedOrigins = ['http://localhost:1234', 'http://testsite.com'];
app.use(cors());
// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1){
//             let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(morgan('common'));

// ----User Endpoints---- //

/**
 * Retrieve all users
 * Method: GET
 * Endpoint: /users
 * Request Body: Bearer Token
 * @returns array of all user objects
 * @requires passport
 */
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Retrieves a single user by their username
 * Method: GET
 * Endpoint: /users/:Username
 * Request Body: Bearer Token
 * @returns single user object
 * @requires passport
 */
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({ Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Create (register) a new user
 * Method: POST
 * Endpoint: /users
 * Request Body: Bearer Token, JSON user object
 * Expected JSON Format Example:
 *  {
 *      Username : "user_name",
 *      Password : "user_password",
 *      Email : "valid_user_email",
 *      Birthday : "1990-01-28"
 *  }
 * @returns new user object
 * @requires passport
 */
app.post('/users', 
    [
        check('Username', 'Username is required.').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid.').isEmail()
    ],
    (req, res) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);

        Users.findOne({Username: req.body.Username})
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user)})
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

/**
 * Add a movie to user's favorite list
 * Method: POST
 * Endpoint: /users/:Username/movies/:MovieID
 * Request Body: Bearer Token
 * @param {express.request} req Username
 * @param {express.request} req movieID
 * @param {express.response} res
 * @returns updated user object
 * @requires passport
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

/**
 * Deletes a user by username
 * Method: DELETE
 * Endpoint: /users/:Username
 * Request Body: Bearer Token
 * @param {express.request} req Username
 * @param {express.response} res
 * @returns message indicating the user was deleted
 * @requires passport
 */
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then ((user) => {
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

/**
 * Deletes movie from user's favorites list
 * Method: DELETE
 * Endpoint: /users/:Username/movies/MovieID
 * Request Body: Bearer Token
 * @param {express.request} req Username
 * @param {express.request} req MovieID
 * @param {express.response} res 
 * @returns message indicating movie was deleted from user's list
 * @requires passport
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username : req.params.Username},
        {$pull: { FavoriteMovies: req.params.MovieID}},
        { new : true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * Update a users profile 
 * Method: PUT
 * Endpoint: /users/:Username
 * Request Body: Bearer Token, JSON user object
 * Expected JSON Format Example:
 *  {
 *      Username : "user_name",
 *      Password : "user_password",
 *      Email : "valid_user_email",
 *      Birthday : "1990-01-28"
 *  }
 * @param {express.request} req Username
 * @param {express.response} res
 * @returns updated user object
 */
app.put('/users/:Username',
    [
        check('Username', 'Username is required.').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid.').isEmail()
    ], 
    (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
            {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
            }
        },
        { new: true },
        (err, updatedUser) => {
            if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
            } else {
            res.json(updatedUser);
            }
        });
});
// ----Movie Endpoints---- //

/**
 * Retrieve all movies
 * Method: GET
 * Endpoint: /movies
 * Request Body: Bearer Token
 * @param {express.request} req
 * @param {express.response} res
 * @returns array of all movie objects
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Retrieve a single movie by movie title
 * Method: GET
 * Endpoint: /movies/:Title
 * Request Body: Bearer Token
 * @param {express.request} req movie title
 * @param {express.reponse} res
 * @returns a single movie object
 * @requires passport
 */
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Retrieve genre data from movie object
 * Method: GET
 * Endpoint: /movies/genre/:Name
 * Request Body: Bearer Token
 * @param {express.request} req name of genre
 * @param {express.response} res
 * @returns genre data
 * @requires passport
 */
app.get('/movies/genre/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Genre.Description)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Retrieve director data from movie object
 * Method: GET
 * Endpoint: /movies/director/:Name
 * Request Body: Bearer Token
 * @param {express.request} req name of director
 * @param {express.response} res
 * @returns director data
 * @requires passport
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Director.Bio)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Update a movie by title
 * Method: PUT
 * Endpoint: /movies/:Title
 * Request Body: Bearer Token, JSON movie object
 * Expected JSON Format Example:
 *  {
 *      Title : "Dune",
 *      Description : "...",
 *      Genre : {
 *          Name : "Science Fiction",
 *          Description : "..."
 *      },
 *      Director : {
 *          Name : "Dennis Villeneuve",
 *          Bio : "..."
 *      },
 *      ImagePath : "..."
 *  }
 * @param {express.request} req title of movie
 * @param {express.response} res
 * @return updated movie object
 */
app.put('/movies/:Title',
    (req, res) => {
        const body = req.body
        Movies.findOneAndUpdate({ Title: req.params.Title }, { $set: body },
            { new: true },
            (err, updatedMovie) => {
                if(err) {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                } else {
                    res.json(updatedMovie);
                }
            })
    })

//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});

