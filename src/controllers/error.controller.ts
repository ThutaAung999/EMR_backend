
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
