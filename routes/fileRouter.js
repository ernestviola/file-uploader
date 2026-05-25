import { Router } from 'express';

const fileRouter = Router({ mergeParams: true });

fileRouter.post('/new', (req, res) => {});
fileRouter.post('/:fileId/update', (req, res) => {});
fileRouter.post('/:fileId/delete', (req, res) => {});

export default fileRouter;
