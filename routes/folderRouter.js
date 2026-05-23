import { Router } from 'express';
import { prisma } from '../libs/prisma.js';
import folderController from '../controllers/folderController.js';

const folderRouter = Router();

folderRouter.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    req.status = 'Unauthenticated';
    return next(new Error('Must authenticate'));
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
