// const mime = require('mime');
// const { default: mime } = await import('mime');
import * as mime from 'mime';

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
    return res.status(200).json({ message: 'Success' });
  }

  static async getShow(req, res) {
    const token = req.headers['x-token'];
    // return res.json({token})
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const fileId = req.params.parentId;
    // return res.json({fileId})

    const file = await dbClient.getFileById(fileId);
    // return res.json({file})
    if (!file || file.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.json(file);
  }

  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const parentId = req.query.parentId || 0;
    const page = req.query.page || 0;
    const limit = 20;
    const skip = page * limit;
    const files = await dbClient.getFilesByParentId(userId, parentId, skip, limit);
    return res.status(200).json(files);
  }

  static async putPublish(req, res) {
    const token = req.headers['x-token'];
    // return res.json({token})
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const fileId = req.params.id;
    const file = await dbClient.getFileById(fileId);
    if (!file || file.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    file.isPublic = true;
    await dbClient.updateFile(fileId, file);
    return res.status(200).json(file);
  }

  static async putUnpublish(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const fileId = req.params.id;
    const file = await dbClient.getFileById(fileId);
    if (!file || file.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    file.isPublic = false;
    await dbClient.updateFile(fileId, file);
    return res.status(200).json(file);
  }

  // static async getFile(req, res) {
  //   const fileId = req.params.id;
  //   const file = await dbClient.getFileById(fileId);
  //   // return res.json({file})
  //   const { isPublic } = file;
  //   // return res.json({isPublic})

  //   if (!file || !isPublic) {
  //     return res.status(404).json({ error: 'Not found' });
  //   }
  //   const { type } = file;
  //   // return res.json({type})
  //   if (type === 'folder') {
  //     return res.status(400).json({ error: 'A folder doesn\'t have content' });
  //   }

  //   const { localPath } = file;
  //   if (!fs.existsSync(localPath)) {
  //     return res.status(404).json({ error: 'Not found' });
  //   }
  //   const mimeType = mime.lookup(file.name) || 'application/octet-stream';
  //   res.set('Content-Type', mimeType);
  //   fs.createReadStream(localPath).pipe(res);
  // }
  // return res.status(200).json("success")
  static async getFile(req, res) {
    const fileId = req.params.id;
    const token = req.headers['x-token'];
    const file = await dbClient.getFileById(fileId);
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { isPublic } = file;
    if (!file || (file.userId !== userId && !isPublic)) {
      return res.status(404).json({ error: 'Not found' });
    }
    const { type } = file;
    if (type === 'folder') {
      return res.status(400).json({ error: 'A folder doesn\'t have content' });
    }

    const { localPath } = file;
    if (!fs.existsSync(localPath)) {
      return res.status(404).json({ error: 'Not found' });
    }
    // const mimeType = mime.lookup(file.name) || 'application/octet-stream';
    // res.set('Content-Type', mimeType);
    // fs.createReadStream(localPath).pipe(res);
    const mimeType = mime.lookup(file.name) || 'application/octet-stream';
    const fileContent = fs.readFileSync(localPath);

    res.set('Content-Type', mimeType);
    return res.send(fileContent);
  }
}

module.exports = FilesController;
