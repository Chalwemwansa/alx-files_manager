// module contains the routes to be used in our server
import express from 'express';
import AppController from '../controllers/AppController';

// create a router to hold the routes for you
const router = express.Router();

// define the route end points and the handlers
// automatic passing of args to the functions put as handlers
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// exports the newly created router
module.exports = router;