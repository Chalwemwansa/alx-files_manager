// module contains a redis class that has the functions set a key,
// get a key as well as deleting a key from redis
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient()
      .on('error', (err) => {
        console.log(err);
      });
  }

  // function that checks if redis has been connected successfully
  // and returns true if yes else it returns false
  isAlive() {
    return (this.client.connected);
  }

  // the asynchronous get method that returns a value for a key
  // passed as an argument
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  // method that sets a value for a key for a specified period of time
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}

// create an instance of redis client and export it
const redisClient = new RedisClient();
module.exports = redisClient;
