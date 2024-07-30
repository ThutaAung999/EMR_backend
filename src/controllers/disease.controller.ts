import {IRequest, IResponse} from '../types/types'
import {NextFunction} from "express";

import * as diseaseService from '../services/disease.service';

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

//------------------------------------------------------------------------------------------------
//after updating

export const getAllDiseaseHandlerWithPagination =
    async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const { page = 1, limit = 5, search = "", sortBy,sortOrder } = req.query;

        const query = {
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc',
          };

        const { data, total } = await diseaseService.getAllDiseasesWithPagination(query);


        res.status(200).json({ data, total, page: query.page, totalPages: Math.ceil(total / query.limit) });
  } catch (err) {
    next(err);
  }
};


export const getAllDiseasesWithPagination =
    async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getAllDiseaseHandlerWithPagination, 400)(req, res, next);
  };


//------------------------------------------------------------------------------------------------



export const getDiseaseByIdHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {

    let diseaseId = req.params['diseaseId'];

    const disease = await diseaseService.getDiseaseById(diseaseId);

    if (!disease) throw Error('No disease found you search by id :'+disease);
    await res.status(200).json(disease);

}

export const getDiseaseById = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getDiseaseByIdHandler, 404)
    (req, res, next);
}


export const newDisease = async (req: IRequest, res: IResponse, next: NextFunction) => {
    console.log("new patient in DiseaseController ", req.body);
    try {
        // Validation
        //const { error, data } = validateDisease(req.body);
        const {error, data} = req.body;
        if (error) {
            console.log("new disease validation fail");
            return res.status(400).json(error);
        }

        const disease = await diseaseService.newDisease(req.body)

        if (!disease) {
            throw new Error('Cannot save disease');
        }

        res.status(201).json(disease);
    } catch (err) {
        console.log(err);
        res.status(400).json();
    }
};



export const updateDisease = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let diseaseId = req.params['diseaseId'];

    // Validation
    //const { error, data } = validateDisease(req.body);

    let disease = req.body;
    console.log(`new disease : ${diseaseId} `, req.body);
    try {
        const updateDisease = await diseaseService.updateDisease(diseaseId,disease);

        if (!updateDisease) throw Error('Cannot update Disease');
        await res.status(200).json(updateDisease);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}




export const deleteDisease = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let diseaseId = req.params['diseaseId'];

    try {
        const deletedDiseasse = await diseaseService.deleteDisease(diseaseId);

        if (!deletedDiseasse) throw Error('Cannot delete disease');
        await res.status(200).json(deletedDiseasse);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}

