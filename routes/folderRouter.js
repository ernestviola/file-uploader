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

folderRouter.post('/:id/create', folderController.postCreateFolder);
folderRouter.post('/:id/update', folderController.postUpdateFolder);
folderRouter.post('/:id/delete', folderController.postDeleteFolder);

folderRouter.get('/home', folderController.getRoot);
folderRouter.get('/:id', folderController.getFolder);

export default folderRouter;
