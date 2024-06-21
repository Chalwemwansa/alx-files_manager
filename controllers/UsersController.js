// module contains definitions for the users controller functions
import dbClient from '../utils/db';

const UsersController = {
  // req is the request and res is the response object
  postNew: async (req, res) => {
    const email = req.body.email || null;
    const password = req.body.password || null;

    if (email === null) {
      res.status(400).json({ error: 'Missing email' });
    }
    if (password === null) {
      res.status(400).json({ error: 'Missing password' });
    } else if (await dbClient.exists(email)) {
      res.status(400).json({ error: 'Already exist' });
    } else {
      const user = await dbClient.addUser(email, password);
      res.status(201).json({ id: user._id, email: user.email });
    }
  },
};

module.exports = UsersController;
