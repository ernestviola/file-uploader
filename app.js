import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prismaSession } from './libs/session.js';
import passport from './libs/passport.js';
import authRouter from './routes/authRouter.js';
import folderRouter from './routes/folderRouter.js';

const PORT = process.env.PORT || 3000;
const viewsPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'views',
);
const publicPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'public',
);

const app = express();
app.set('views', viewsPath);
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

app.use(prismaSession);
app.use(passport.session());
app.use(passport.initialize());

// Automatically set currentUser for views
app.use((req, res, next) => {
  if (req.user) {
    res.locals.currentUser = req.user;
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/folders', folderRouter);

app.use(authRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).send(err.message);
});

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App listening on port ${PORT}`);
});
