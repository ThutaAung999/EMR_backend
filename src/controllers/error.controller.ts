// import { Request, Response, NextFunction } from 'express';
// import AppError from './../utils/appError';

// // Type definitions for custom error handlers
// interface MongoError extends Error {
//     code?: number;
//     errmsg?: string;
//     path?: string;
//     value?: string;
//     errors?: { [key: string]: any };
// }

// const handleCastErrorDB = (err: MongoError): AppError => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err: MongoError): AppError => {
//     const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
//     console.log(value);

//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err: MongoError): AppError => {
//     const errors = Object.values(err.errors ?? {}).map((el: any) => el.message);

//     const message = `Invalid input data. ${errors.join('. ')}`;
//     return new AppError(message, 400);
// };

// const handleJWTError = (): AppError =>
//     new AppError('Invalid token. Please log in again!', 401);

// const handleJWTExpiredError = (): AppError =>
//     new AppError('Your token has expired! Please log in again.', 401);

// const sendErrorDev = (err: any, req: Request, res: Response): Response => {
//     // A) API
//     if (req.originalUrl.startsWith('/api')) {
//         return res.status(err.statusCode).json({
//             status: err.status,
//             error: err,
//             message: err.message,
//             stack: err.stack,
//         });
//     }

//     // B) RENDERED WEBSITE
//     console.error('ERROR 💥', err);

//     res.status(err.statusCode).render('error', {
//         title: 'Something went wrong!',
//         msg: err.message,
//     });

//     return res;
// };

// const sendErrorProd = (err: any, req: Request, res: Response): Response => {
//     // A) API
//     if (req.originalUrl.startsWith('/api')) {
//         // A) Operational, trusted error: send message to client
//         if (err.isOperational) {
//             return res.status(err.statusCode).json({
//                 status: err.status,
//                 message: err.message,
//             });
//         }

//         // B) Programming or other unknown error: don't leak error details
//         // 1) Log error
//         console.error('ERROR 💥', err);

//         // 2) Send generic message
//         return res.status(500).json({
//             status: 'error',
//             message: 'Something went very wrong!',
//         });
//     }

//     // B) RENDERED WEBSITE
//     // A) Operational, trusted error: send message to client
//     if (err.isOperational) {
//         console.log(err);
//         res.status(err.statusCode).render('error', {
//             title: 'Something went wrong!',
//             msg: 'Please try again later',
//         });
//         return res;
//     }
//     // B) Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error('ERROR 💥', err);

//     // 2) Send generic message
//     res.status(err.statusCode).render('error', {
//         title: 'Something went wrong!',
//         msg: 'Please try again later',
//     });
//     return res;
// };

// const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
//     // err.statusCode = err.statusCode || 500;
//     // err.status = err.status || 'error';
//     err.status = err.status || 500; // Default to 500 if no status is provided
//     err.message = err.message || 'Internal Server Error';

//     console.log(process.env.NODE_ENV);
//     if (process.env.NODE_ENV === 'development') {
//         return sendErrorDev(err, req, res);
//     } else if (process.env.NODE_ENV?.trim() === 'production') {
//         let error: any = { ...err };
//         error.message = err.message;

//         if (error.name === 'CastError') error = handleCastErrorDB(error);
//         if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//         if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
//         if (error.name === 'JsonWebTokenError') error = handleJWTError();
//         if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

//         // Handle 404 errors for routes not found
//         if (error.status === 'fail' && error.statusCode === 404) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Resource not found',
//             });
//         }

//         console.log("err.message", err.message);
//         console.log("error.message", error.message);
//         return sendErrorProd(error, req, res);
//     }

//     // Default response for cases not handled above
//     return res.status(err.statusCode).json({
//         status: 'error',
//         message: 'An unknown error occurred!',
//     });
// };

// export default globalErrorHandler;


import { Request, Response, NextFunction } from 'express';
import AppError from './../utils/appError';

// Type definitions for custom error handlers
interface MongoError extends Error {
    code?: number;
    errmsg?: string;
    path?: string;
    value?: string;
    errors?: { [key: string]: any };
}

// Handle database-related errors
const handleCastErrorDB = (err: MongoError): AppError => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongoError): AppError => {
    const errors = Object.values(err.errors ?? {}).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError =>
    new AppError('Your token has expired! Please log in again.', 401);

// Send error details in development mode
const sendErrorDev = (err: any, req: Request, res: Response): Response => {
    return res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// Send error details in production mode
const sendErrorProd = (err: any, req: Request, res: Response): Response => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};

// Global error handler middleware
const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV?.trim() === 'production') {
        let error: any = { ...err };
        error.message = err.message;

        // Handle specific errors
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        return sendErrorProd(error, req, res);
    }

    // Fallback in case no conditions are met
    return res.status(err.statusCode).json({
        status: 'error',
        message: 'An unknown error occurred!',
    });
};

export default globalErrorHandler;
