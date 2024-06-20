import { Request, Response, NextFunction } from 'express';
import { IPatient } from '../models/Patient'; // Adjust the path as per your project structure

export interface IRequest extends Request {
    // Define any custom properties if needed
}

export interface IResponse extends Response {
    // Define any custom properties if needed
}
