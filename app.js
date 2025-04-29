//app.js

import createError from 'http-errors';
import express from 'express';
import { fileURLToPath } from 'node:url';
import path, {dirname} from 'node:path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import winstonLogger from "./utils/logger.js"
import timeSlotRoutes from "./routes/timeSlot.js"
import indexRouter from './routes/index.js';
import appointmentRoutes from './routes/appointments.js'
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import db from './config/db.js';
//import { error } from 'node:console';

const app = express();
await db.initializeDbSchema();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const morganFormat = process.env.NODE_ENV === "production" ? "dev" : 'combined'
app.use(morgan(morganFormat, { stream: winstonLogger.stream }));

app.use(morgan(morganFormat, { stream: winstonLogger.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/timeslots', timeSlotRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/api/auth', authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({error: {message: err.message, status: err.status || 500,
  },
  });
});

export default app;