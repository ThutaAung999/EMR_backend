import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet'
//import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

import patientRouter from './routes/patients.route';
import medicineRouter from './routes/medicines.route';
import diseaseRouter from './routes/diseases.route';
import doctorRouter from './routes/doctors.route';
import tagRouter from './routes/tags.route';
import emrImageRouter from './routes/emr.images.route'
import emrRouter from './routes/emr.route';


//import auth from './middleware/auth';
import config from './config/database';

//import setupRoutes from "./routes";

import HttpLoggerMiddleware from './middleware/http.logger.middleware'

dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/********************/
// Configure CORS
const corsOptions = {
    origin: ['http://localhost:5000', 'http://localhost:5174'],  // Allow requests from this origin
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions)); // Use cors middleware with options

app.use(helmet());
app.use(express.json());//this is bodyParser.json()
app.use(express.urlencoded({ extended: true }));

app.use(HttpLoggerMiddleware)

/************************/

mongoose.connect(config.db).then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

//setupRoutes(app);
app.use('/api/patients', patientRouter);
app.use('/api/medicines',medicineRouter);
app.use('/api/diseases',diseaseRouter);
app.use('/api/doctors',doctorRouter);
app.use('/api/tags',tagRouter);
app.use("/api/emrImages",emrImageRouter);
app.use("/api/emrs",emrRouter);



// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Server Error: ", err); // Ensure this logs the error details
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
