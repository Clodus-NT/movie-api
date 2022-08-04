# Movie API

## Description
The server-side component of my nixFlix movie web application. This RESTful API provides access to 10 different movies with a descriptions, movie image, directors (with bios) and genres (with descriptions). It also allows users to be able to sign up, update their profile information, and add movies to a list of favorites.

## Context
This was a student project completed during the CareerFoundry Full-Stack Web Development course. The purpose was to learn how to build a RESTful API from the ground up.

## Features
- Return a list of **all** movies
- Return data (description, genre, director, image URL) about a single movie by title
- Return data about a genre (description) by name/title (e.g. "Horror")
- Return data about a director (bio) by name
- Allow new users to register
- Allow users to login
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow users to deregister and delete their account

## Endpoints with HTTP method type
- Return a list of all movies (**GET**)
  - /movies
- Return a single movie's data by title (**GET**)
  - /movies/:Title
- Return genre data by name (**GET**)
  - /movies/genre/:genreName
- Return director data by name (**GET**)
  - /movies/directors/:directorName
- Return a list of all registered users (**GET**)
  - /users
- Return a single user's data (**GET**)
  - /users/:Username
- Allow new users to register (**POST**)
  - /users
- Allow existing users to login (**POST**)
  - /users/:Username/password/:Password
- Allow users to update their profile info (**PUT**)
  - /users/:Username
- Allow users to add a movie to their favorites list (**POST**)
  - /users/:Username/movies/MovieID
- All users to remove a movie from their favorites list (**DELETE**)
  - /users/:Username/movies/MovieID
- Allow users to delete their account (**DELETE**)
  - /users/:Username

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- Heroku
- Postman

## Dependendcies
- "bcrypt": "^5.0.1",
- "body-parser": "^1.19.1",
- "cors": "^2.8.5",
- "express": "^4.17.2",
- "express-validator": "^6.14.0",
- "jsonwebtoken": "^8.5.1",
- "mongoose": "^6.2.3",
- "morgan": "^1.10.0",
- "nodemon": "^2.0.15",
- "passport": "^0.5.2",
- "passport-jwt": "^4.0.0",
- "passport-local": "^1.0.0",
- "uuid": "^8.3.2"