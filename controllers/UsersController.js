const sha1 = require('sha1');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const checkUser = await dbClient.getUserByEmail(email);
    if (checkUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPasssword = sha1(password);
    const newUser = {
      email,
      password: hashedPasssword,
    };
    const result = await dbClient.insertUser(newUser);
    return res.status(201).json({ email: result.email, id: result._id });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    // return res.json({token})
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);
    // return res.json({userId})
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await dbClient.getUserById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
