// module contains an object with keys and function for each function
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FilesController = {
  postUpload: async (req, res) => {
    const tokenObj = req.headers['x-token'] || null;
    const token = `auth_${tokenObj}`;
    if (token === null) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const userId = await redisClient.get(token) || null;
      if (userId === null) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const user = await dbClient.getUser('dummy entry', userId) || null;
        if (user === null) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        const name = req.body.name || null;
        const type = req.body.type || null;
        const parentId = req.body.parentId || 0;
        const isPublic = req.body.isPublic || false;
        const data = req.body.data || null;
        const types = ['folder', 'file', 'image'];
        if (name === null) {
          res.status(400).json({ error: 'Missing name' });
        } else if (!types.includes(type)) {
          res.status(400).json({ error: 'Missing type' });
        } else if (data === null && type !== 'folder') {
          res.status(400).json({ error: 'Missing data' });
        } else if (parentId !== 0) {
          const parent = await dbClient.getFile(parentId) || null;
          if (parent === null) {
            res.status(400).json({ error: 'Parent not found' });
            return;
          } if (parent.type !== 'folder') {
            res.status(400).json({ error: 'Parent is not a folder' });
            return;
          }
        }
        const content = {
          userId: user._id,
          name,
          type,
          isPublic,
        };
        if (parentId === 0) {
          content.parentId = 0;
        } else {
          content.parentId = new ObjectId(parentId);
        }
        if (type !== 'folder') {
          const newData = Buffer.from(data, 'base64').toString('utf8');
          let path = process.env.FOLDER_PATH || '/tmp/files_manager';
          path += `/${uuidv4()}`;
          content.localPath = path;
          fs.writeFile(path, newData, (error) => {
            if (error) {
              console.log(`error: ${error}`);
            }
          });
        }
        const file = await dbClient.addFile(content);
        const response = {
          id: file._id,
          userId: file.userId,
          name: file.name,
          type: file.type,
          isPublic: file.isPublic,
          parentId: file.parentId,
        };
        res.status(201).json(response);
      }
    }
  },
  getShow: async (req, res) => {
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
        if (user === null) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        const id = req.params.id || null;
        const file = await dbClient.getFile(id) || null;
        if (file === null) {
          res.status(404).json({ error: 'Not found' });
        } else {
          const response = {
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
          };
          res.status(200).json(response);
        }
      }
    }
  },
  getIndex: async (req, res) => {
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
        if (user === null) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        const parentId = req.query.parentId || null;
        const page = req.query.page || 0;
        if (parentId !== null) {
          const parent = await dbClient.getFile(parentId) || null;
          if (parent === null) {
            res.status(200).json([]);
            return;
          }
        }
        const response = await dbClient.getAll(user, parentId, page * 20);
        res.status(200).json(response);
      }
    }
  },
};

module.exports = FilesController;
