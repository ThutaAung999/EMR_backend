import {IRequest, IResponse} from '../types/types'
import {NextFunction} from "express";

import * as doctorService from "../services/doctor.service";


const handle = (func: Function, httpErrorCode: number) => {
    return async (req: IRequest, res: IResponse, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (err) {
            console.log("Error is ", err);
            await res.status(httpErrorCode).json({message: err});
        }
    };
};


export const getAllDoctorHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const doctors = await doctorService.getAllDoctors() ;

        if (!doctors) {
            throw new Error('No doctors');
        }
        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

export const getAllDoctors = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getAllDoctorHandler, 400)(req, res, next);
};


export const getDoctorByIdHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {

    let doctorId = req.params['doctorId'];

    const doctor = await doctorService.getDoctorById(doctorId);

    if (!doctor) throw Error('No doctor found you search by id :'+doctor);
    await res.status(200).json(doctor);

}

export const getDoctorById = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getDoctorByIdHandler, 404)(req, res, next);
}

export const newDoctor = async (req: IRequest, res: IResponse, next: NextFunction) => {
    console.log("new doctor in DoctorController ", req.body);
    try {
        // Validation
        //const { error, data } = validateDoctor(req.body);

        const {error, data} = req.body;
        if (error) {
            console.log("new doctor validation fail");
            return res.status(400).json(error);
        }

        const doctor = await doctorService.newDoctor(req.body);

        if (!doctor) {
            throw new Error('Cannot save doctor');
        }

        res.status(201).json(doctor);
    } catch (err) {
        console.log(err);
        res.status(400).json();
    }
};



export const updateDoctor = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let doctorId = req.params['doctorId'];

    // Validation
    //const { error, data } = validateDioctor(req.body);

    let doctor = req.body;
    console.log(`new doctor : ${doctorId} `, req.body);
    try {
        const updateDoctor = await doctorService.updateDoctor(doctorId,doctor);

        if (!updateDoctor) throw Error('Cannot update DoctorModel');
        await res.status(200).json(updateDoctor);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}


export const deleteDoctor = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let doctorId = req.params['doctorId'];

    try {
        const deletedDoctor = await doctorService.deleteDoctor(doctorId);

        if (!deletedDoctor) throw Error('Cannot delete doctor');
        await res.status(200).json(deletedDoctor);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}

