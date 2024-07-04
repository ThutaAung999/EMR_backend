import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import createError from 'http-errors';
import helmet from 'helmet';
import logger from 'morgan';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import hpp from 'hpp';

import config from './config/database';

import patientRouter from './routes/patients.route';
import medicineRouter from './routes/medicines.route';
import diseaseRouter from './routes/diseases.route';
import doctorRouter from './routes/doctors.route';
import tagRouter from './routes/tags.route';
import emrImageRouter from './routes/emr.images.route';
import emrRouter from './routes/emr.route';
import userRouter from './routes/userRoute';


import AppError from './utils/appError';
import globalErrorHandler from './controllers/error.controller';
import HttpLoggerMiddleware from './middleware/http.logger.middleware';



// Load the .env file
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure CORS
const corsOptions = {
    origin: ['http://localhost:5000', 'http://localhost:9999', 'http://localhost:5174'],
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set security HTTP headers
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());


// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// Test middleware
/* app.use((req: Request, res: Response, next: NextFunction) => {
    req.requestTime = new Date().toISOString();
    next();
});
 */
app.use(HttpLoggerMiddleware);

// Database connection
mongoose
    .connect(config.db)
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.log(err));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let date = new Date();
        let imageFileName = date.getTime() + '_' + file.originalname;
        cb(null, imageFileName);
    },
});

/* 
const multerFilter: multer.FileFilterCallback = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Implement your file filter logic here
    if (file.mimetype.startsWith('image')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only images are allowed!'), false); // Reject the file
    }
  };
 */



// Initialize multer with your configuration
//const upload = multer({ storage: storage, fileFilter: multerFilter });

const upload = multer({ storage }).any();

// Route to handle file uploads
app.post('/api/emrs/uploads', upload, (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ msg: 'No file selected!' });
    } else {
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
            image: `uploads/${file.filename}`,
        }));

        return res.status(200).json({
            msg: 'Files uploaded!',
            images: uploadedFiles,
        });
    }
});

// Routes
app.use('/api/patients', patientRouter);
app.use('/api/medicines', medicineRouter);
app.use('/api/diseases', diseaseRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/tags', tagRouter);
app.use('/api/emrImages', emrImageRouter);
app.use('/api/emrs', emrRouter);

app.use("/api/users", userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
