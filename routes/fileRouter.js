import { Router } from 'express';
import fileController from '../controllers/fileController.js';

const fileRouter = Router({ mergeParams: true });

fileRouter.post('/new', fileController.postNewFile);

fileRouter.get('/:fileId/download', fileController.getDownload);
fileRouter.post('/:fileId/update', fileController.postUpdate);
fileRouter.post('/:fileId/delete', fileController.postDelete);

export default fileRouter;
