// module contains an object that is used to authenticate a user to log in
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {
  getConnect: async (req, res) => {
    const authHeaders = req.headers.authorization || null;
    if (authHeaders === null) {
      res.status(401).json({ error: 'Unauthorized' });
    } else if (authHeaders.split(' ')[0] !== 'Basic') {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const credentials = Buffer.from(authHeaders.split(' ')[1], 'base64').toString('utf8');
      const [email, password] = credentials.split(':');
      if (!dbClient.exists(email)) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const user = await dbClient.getUser(email);
        if (sha1(password).toString() !== user.password) {
          res.status(401).json({ error: 'Unauthorized' });
        } else {
          const token = uuidv4();
          const key = `auth_${token}`;
          await redisClient.set(key, user._id.toString(), 86400);
          res.status(200).json({ token });
        }
      }
    }
  },

  getDisconnect: async (req, res) => {
    const key = `auth_${req.headers['x-token']}`;
    const userId = await redisClient.get(key) || null;
    if (userId === null) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      await redisClient.del(key);
      res.status(204).end();
    }
  },
};

module.exports = AuthController;
