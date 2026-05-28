import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const indexController = {};

indexController.get = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/folders/home');
  }
  try {
    const files = await readdir(
      path.join(__dirname, '../public/folder-assets'),
    );
    res.render('index', { files: files });
  } catch (error) {
    const err = new Error('Unable to load');
    err.statusCode = 500;
    next(err);
  }
};

export default indexController;
