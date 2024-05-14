const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  // static async postUpload(req, res) {
  //   const {
  //     name, type, data, parentId = '0', isPublic = false,
  //   } = req.body;
  //   const token = req.headers['x-token'];

  //   // Retrieving user based on the token
  //   const userId = await redisClient.get(`auth_${token}`);
  //   if (!userId) {
  //     return res.status(401).json({ error: 'Unauthorized' });
  //   }

  //   // Validation checks
  //   if (!name) {
  //     return res.status(400).json({ error: 'Missing name' });
  //   }
  //   if (!type || !['folder', 'file', 'image'].includes(type)) {
  //     return res.status(400).json({ error: 'Missing or invalid type' });
  //   }
  //   if (type !== 'folder' && !data) {
  //     return res.status(400).json({ error: 'Missing data' });
  //   }

  //   // If parentId is set, check if parent exists and is a folder
  //   if (parentId !== '0') {
  //     const parentFile = await dbClient.getFileById(parentId);
  //     if (!parentFile || parentFile.type !== 'folder') {
  //       return res.status(400).json({ error: 'Parent not found or not a folder' });
  //     }
  //   }

  //   // Prepare file document
  //   const fileDocument = {
  //     userId,
  //     name,
  //     type,
  //     isPublic,
  //     parentId,
  //   };

  //   // If type is not a folder, save file content to disk
  //   if (type !== 'folder') {
  //     const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
  //     const filePath = path.join(folderPath, `${uuidv4()}`);
  //     const fileContent = Buffer.from(data, 'base64');

  //     try {
  //       fs.writeFileSync(filePath, fileContent);
  //       fileDocument.localPath = filePath;
  //     } catch (error) {
  //       console.error('Error saving file to disk:', error);
  //       return res.status(500).json({ error: 'Internal server error' });
  //     }
  //   }

  //   // Insert file document into DB
  //   const insertedFile = await dbClient.insertFile(fileDocument);

  //   return res.status(201).json(insertedFile);
  // }
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // const user = await dbClient.getUserById(userId);
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;
    // return res.json({name, type, parentId, isPublic, data})
    if (!name) {
      res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId !== 0) {
      const file = await dbClient.getFileById(parentId);
      if (!file) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    let localPath = '';
    if (type !== 'folder') {
      const folder = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      localPath = path.join(folder, uuidv4());
      fs.writeFileSync(localPath, data, 'base64');
      const newFile = await dbClient.createFile({
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath,
      });
      return res.status(201).json(newFile);
    }

    if (type === 'folder') {
      const newFile = await dbClient.createFile({
        userId,
        name,
        type,
        parentId,
        isPublic,
        localPath: type !== 'folder' ? localPath : undefined,
      });
      return res.status(201).json(newFile);
    }
  }
}

module.exports = FilesController;
