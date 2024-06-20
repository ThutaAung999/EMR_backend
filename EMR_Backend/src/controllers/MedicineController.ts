import {IRequest, IResponse} from '../types/types';
import * as medicineService from '../services/medicine.service';
/*import { validatePatient } from './validators'; */
import {NextFunction} from 'express';

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

export const getAllMedicineHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const medicines = await medicineService.getAllMidicine();

        if (!medicines) {
            throw new Error('No patients');
        }
        res.status(200).json(medicines);
    } catch (err) {
        next(err);
    }
};

export const getAllMedicines = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getAllMedicineHandler, 400)(req, res, next);
};

export const getMedicineByIdHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {

    let medicineId = req.params['medicineId'];
    console.log('Req medicine Id :', medicineId);

    const medicine = await medicineService.getMedicineById(medicineId);

    if (!medicine) throw Error('No MedicineModel found you search by id :'+medicineId);
    await res.status(200).json(medicine);

}

export const getMedicineById = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getMedicineByIdHandler, 404)
    (req, res, next);
}


export const findMedicineByName = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let name = req.params['name'];
    try {
        const medicines = await medicineService.searchMedicineByName(name);

        if (!medicines) throw Error('No medicines found');
        await res.status(200).json(medicines);

    } catch (err) {
        await res.status(404).json({message: err})
    }
}



export const newMedicine = async (req: IRequest, res: IResponse, next: NextFunction) => {
    console.log("new medicine in MedicineController :", req.body);
    try {
        // Validation
        //const { error, data } = validateMedicine(req.body);
        const {error, data} = req.body;
        if (error) {
            console.log("new medicine validation fail");
            return res.status(400).json(error);
        }

        const medicine = await medicineService.newMedicine(req.body);

        if (!medicine) {
            throw new Error('Cannot save medicine');
        }

        res.status(201).json(medicine);
    } catch (err) {
        console.log(err);
        res.status(400).json();
    }
};



export const updateMedicine = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let medicineId = req.params['medicineId'];

    // Validation
    //const { error, data } = validateMedicine(req.body);

    let medicine = req.body;
    console.log(`new medicine : ${medicineId} `, req.body);
    try {
        const updateMedicine = await medicineService.updateMedicine(medicineId,medicine);

        if (!updateMedicine) throw Error('Cannot update MedicineModel');
        await res.status(200).json(updateMedicine);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}


export const deleteMedicine = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let medicineId = req.params['medicineId'];
    console.log("medicineId : ",medicineId);
    try {
        const deletedMedicine = await medicineService.deleteMedicine(medicineId);

        if (!deletedMedicine) throw Error('Cannot delete medicine');
        await res.status(200).json(deletedMedicine);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}

/*

export default {
    getAllMedicines,


};
*/

