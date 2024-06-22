// module contains the routes to be used in our server
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

// create a router to hold the routes for you
const router = express.Router();

// define the route end points and the handlers
// automatic passing of args to the functions put as handlers

// the controllers for the index
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// the controllers for the users
router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// the controllers for authentication
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// the controllers for the files routes
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

// exports the newly created router
module.exports = router;
