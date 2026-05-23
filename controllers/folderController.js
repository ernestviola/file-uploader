import { prisma } from '../libs/prisma.js';

const folderController = {};

folderController.getRoot = async (req, res, next) => {
  const folder = await prisma.folder.findFirst({
    where: {
      ownerId: req.user.id,
      isRoot: true,
    },
    include: { children: true, files: true },
  });

  if (!folder) {
    const err = new Error('404 - Not Found');
    err.statusCode = 404;
    return next(err);
  }

  const breadcrumbs = [{ id: folder.id, name: folder.name }];

  //root dir or query parameter
  // get the id of the root folder and will redirect to it
  res.render('folders/folder', { folder, breadcrumbs });
};

folderController.getCurrentFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.findFirst({
    where: {
      ownerId: req.user.id,
      id: Number(id),
    },
    include: { children: true, files: true },
  });

  if (!folder) {
    const err = new Error('404 - Not Found');
    err.statusCode = 404;
    return next(err);
  }

  console.log(id);
  res.render('folders/folder', { folder });
};

export default folderController;
