// module contains the routes to be used in our server
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

// create a router to hold the routes for you
const router = express.Router();

// define the route end points and the handlers
// automatic passing of args to the functions put as handlers

// the controllers for the index
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// the controllers for the users
router.post('/users', UsersController.postNew);

// exports the newly created router
module.exports = router;
