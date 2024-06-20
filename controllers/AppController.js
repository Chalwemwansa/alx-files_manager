// module contains controllers for the routes
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  // keys for the callback functions
  getStatus: (req, res) => {
    const dbStatus = dbClient.isAlive();
    const redisStatus = redisClient.isAlive();
    const body = {
      redis: redisStatus,
      db: dbStatus,
    };
    res.status(200).json(body);
  },
  getStats: async (req, res) => {
    const userTotal = await dbClient.nbUsers();
    const fileTotal = await dbClient.nbFiles();
    const body = {
      users: userTotal,
      files: fileTotal,
    };
    res.status(200).json(body);
  }
}

// export a object instance
module.exports = AppController;