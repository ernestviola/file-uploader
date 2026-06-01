import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { body, validationResult, matchedData } from 'express-validator';

import { bucket } from '../libs/storage.js';
import { prisma } from '../libs/prisma.js';

const MAX_STORAGE_BYTES = 104857600;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 mb file size limit
});

const validateFileName = [
  body('name').trim().notEmpty().withMessage('File name is required.'),
];

const fileController = {};

fileController.getDownload = async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const folderId = parseInt(req.params.folderId);
  const fileId = parseInt(req.params.fileId);

  const file = await prisma.file.findFirst({
    where: {
      ownerId: userId,
      id: fileId,
      folderId: folderId,
    },
  });

  if (!file) {
    const err = new Error('File not found');
    err.statusCode = 404;
    return next(err);
  }

  const blob = bucket.file(file.filePath);
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${file.name}.${file.extension}"`,
  );

  blob
    .createReadStream()
    .on('error', (err) => {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).send('Download failed.');
      }
    })
    .pipe(res);
};

fileController.postNewFile = [
  upload.array('files', 20),
  async (req, res, next) => {
    const userId = req.user.id;
    const folderId = req.params.folderId;

    const folder = await prisma.folder.findFirst({
      where: {
        id: parseInt(folderId),
        ownerId: parseInt(userId),
      },
    });

    if (!folder) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      return next(err);
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileId = uuid();
      const fileName = path.basename(
        file.originalname,
        path.extname(file.originalname),
      );
      const extension = path.extname(file.originalname).slice(1) || 'bin';

      const gcsPath = `${userId}/${fileId}.${extension}`;

      uploadedFiles.push({
        ownerId: parseInt(userId),
        folderId: parseInt(folderId),
        name: fileName,
        extension: extension,
        filePath: gcsPath,
        size: file.size,
        mimeType: file.mimetype,
        file: file,
      });
    }

    try {
      // check if the user has enough space for the new files
      const usage = await prisma.file.aggregate({
        where: {
          ownerId: req.user.id,
        },
        _sum: { size: true },
      });

      const currentUsageSize = usage._sum.size ?? 0;

      const newFilesTotalSize = uploadedFiles.reduce(
        (accumulator, file) => accumulator + file.size,
        0,
      );
      const totalNewUsage = currentUsageSize + newFilesTotalSize;

      if (totalNewUsage > MAX_STORAGE_BYTES) {
        throw new Error(
          `You'll be over your storage limit ${totalNewUsage} / ${MAX_STORAGE_BYTES}`,
        );
      }

      const blobs = uploadedFiles.map((data) => {
        return bucket.file(data.filePath).save(data.file.buffer, {
          contentType: data.file.mimetype,
        });
      });

      await Promise.all(blobs);
      await prisma.file.createMany({
        data: uploadedFiles.map(({ file, ...rest }) => rest),
      });
      return res.redirect(`/folders/${folderId}`);
    } catch (error) {
      console.error('Upload error:', error);

      // clean up failed gcs files to be retried by the user
      await Promise.all(
        uploadedFiles.map((f) =>
          bucket
            .file(f.filePath)
            .delete()
            .catch(() => {}),
        ),
      );

      const err = new Error(error.message || 'Failed to upload files');
      err.statusCode = 500;
      return next(err);
    }
  },
];

fileController.postUpdate = [
  validateFileName,
  async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const fileId = parseInt(req.params.fileId);
    const folderId = parseInt(req.params.folderId);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return req.redirect(`/folders/${folderId}`);
    }

    const { name } = matchedData(req);

    await prisma.file.update({
      where: {
        ownerId: userId,
        id: fileId,
        folderId: folderId,
      },
      data: {
        name: name,
      },
    });

    return res.redirect(`/folders/${folderId}`);
  },
];

fileController.postDelete = async (req, res, next) => {
  const userId = parseInt(req.user.id);
  const fileId = parseInt(req.params.fileId);
  const folderId = parseInt(req.params.folderId);

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      ownerId: userId,
    },
  });

  if (!file) {
    const err = new Error('File not found');
    return next(err);
  }

  try {
    await prisma.file.delete({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });
    await bucket.file(file.filePath).delete();

    return res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error('Delete error:', error);

    const err = new Error('Failed to delete file');
    err.statusCode = 500;
    return next(err);
  }
};

export default fileController;
