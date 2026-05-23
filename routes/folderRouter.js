import { Router } from 'express';
import { prisma } from '../libs/prisma.js';
import folderController from '../controllers/folderController.js';

const folderRouter = Router();

folderRouter.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    const err = new Error('401 - Must authenticate');
    err.statusCode = 401;
    return next(err);
  }
  return next();
});

folderRouter.get('/home', folderController.getRoot);
folderRouter.get('/:id', folderController.getCurrentFolder);
folderRouter.post('/create', (req, res) => {});
folderRouter.post('/:id', (req, res) => {});
folderRouter.post('/update', (req, res) => {});
folderRouter.post('/delete', (req, res) => {});

export default folderRouter;
