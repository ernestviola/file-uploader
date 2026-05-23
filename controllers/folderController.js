import { prisma } from '../libs/prisma.js';
import { body, validationResult, matchedData } from 'express-validator';

const folderNameValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Folder must have a name.')
    .isLength({ max: 100 })
    .withMessage('Folder name must be 100 characters or less.'),
];

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

  res.render('folders/folder', { folder, breadcrumbs });
};

folderController.getFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.findFirst({
    where: {
      ownerId: req.user.id,
      id: parseInt(id),
    },
    include: { children: true, files: true },
  });

  if (!folder) {
    const err = new Error('404 - Not Found');
    err.statusCode = 404;
    return next(err);
  }

  // recursively set the breadcrumb of current and
  // set current to the parent folder until we're at the root
  const breadcrumbs = [];
  let currentFolder = folder;
  while (currentFolder !== null) {
    breadcrumbs.push({ id: currentFolder.id, name: currentFolder.name });
    if (currentFolder.parentId) {
      currentFolder = await prisma.folder.findFirst({
        where: {
          ownerId: req.user.id,
          id: currentFolder.parentId,
        },
      });
    } else {
      currentFolder = null;
    }
  }
  breadcrumbs.reverse();
  res.render('folders/folder', { folder, breadcrumbs });
};

folderController.postCreateFolder = [
  folderNameValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    const parentId = parseInt(req.params.id);
    const { name } = matchedData(req);
    if (!errors.isEmpty()) {
      // probably shouldn't allow
    }
    const newFolder = await prisma.folder.create({
      data: {
        parentId: parentId,
        ownerId: req.user.id,
        name: name,
      },
    });

    res.redirect(`/folders/${parentId}`);
  },
];

folderController.postUpdateFolder = [
  folderNameValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    const parentId = parseInt(req.params.id);

    const { name } = matchedData(req);
    const updatedFolder = await prisma.folder.update({
      where: {
        id: id,
        ownerId: req.user.id,
      },
      data: {
        name: name,
      },
    });
  },
];
folderController.postDeleteFolder = (req, res, next) => {};

export default folderController;
