const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        // Using on('error') to display any errors
        this.client.on('error', (error) => {
            console.error('Redis client failed to connect:', error);
        });
    }

    // Checking if client is connected to Redis
    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, reply) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(reply);
            });
        });
    }

    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (error, reply) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(reply);
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, reply) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(reply);
            });
        });
    }
}

// Creating and exporting an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
