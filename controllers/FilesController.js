const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    const {
      name, type, data, parentId = '0', isPublic = false,
    } = req.body;
    const token = req.headers['x-token'];

    // Retrieving user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validation checks
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // If parentId is set, check if parent exists and is a folder
    if (parentId !== '0') {
      const parentFile = await dbClient.getFileById(parentId);
      if (!parentFile || parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent not found or not a folder' });
      }
    }

    // Prepare file document
    const fileDocument = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    // If type is not a folder, save file content to disk
    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = path.join(folderPath, `${uuidv4()}`);
      const fileContent = Buffer.from(data, 'base64');

      try {
        fs.writeFileSync(filePath, fileContent);
        fileDocument.localPath = filePath;
      } catch (error) {
        console.error('Error saving file to disk:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // Insert file document into DB
    const insertedFile = await dbClient.insertFile(fileDocument);

    return res.status(201).json(insertedFile);
  }
}

module.exports = FilesController;