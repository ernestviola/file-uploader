import { prisma } from '../libs/prisma.js';

const folderController = {};

folderController.getRoot = async (req, res) => {
  const folder = await prisma.folder.findFirst({
    where: {
      ownerId: req.user.id,
      isRoot: true,
    },
    include: { children: true, files: true },
  });

  const breadcrumbs = [{ id: folder.id, name: folder.name }];

  //root dir or query parameter
  // get the id of the root folder and will redirect to it
  res.render('folders/folder', { folder, breadcrumbs });
};

folderController.getCurrentFolder = async (req, res) => {
  res.render('folders/folder');
};

export default folderController;
