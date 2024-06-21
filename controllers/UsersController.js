// module contains definitions for the users controller functions
import dbClient from '../utils/db';

const UsersController = {
  // req is the request and res is the response object
  postNew: async (req, res) => {
    const email = req.body.email || null;
    const password = req.body.password || null;
    let body;

    if (email === null) {
      body = {
        error: 'Missing email',
      };
      res.status(400).json(body);
    } else if (password === null) {
      body = {
        error: 'Missing password',
      };
      res.status(400).json(body);
    } else if (await dbClient.exists(email)){
      body = {
        error: 'Already exist',
      };
      res.status(400).json(body);
    } else {
      const user = await dbClient.addUser(email, password);
      body = {
        id: user._id,
        email: user.email,
      };
      res.status(201).json(body);
    }
  },
};

module.exports = UsersController;
