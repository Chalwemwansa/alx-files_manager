// module contains definitions for the users controller functions
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

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
    } else if (await dbClient.exists(email)) {
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

  getMe: async (req, res) => {
    const tokenObj = req.headers['x-token'] || null;
    const token = `auth_${tokenObj}`;
    if (token === null) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const userId = await redisClient.get(token) || null;
      if (userId === null) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const user = await dbClient.getUser('dummy entry', userId);
        res.status(200).json({ id: user._id, email: user.email });
      }
    }
  },
};

module.exports = UsersController;
