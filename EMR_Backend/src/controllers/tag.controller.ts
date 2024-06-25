import {IRequest, IResponse} from '../types/types'
import {NextFunction} from "express";

import * as tagService from '../services/tag.service';


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

export const getAllTagHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
        const tags = await tagService.getAllTag() ;


        if (!tags) {
            throw new Error('No tags');
        }
        res.status(200).json(tags);
    } catch (err) {
        next(err);
    }
};


export const getAllTags = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getAllTagHandler, 400)(req, res, next);
};



export const getTagByIdHandler = async (req: IRequest, res: IResponse, next: NextFunction) => {

    let tagId = req.params['tagId'];


    const tag = await tagService.getTagById(tagId);
    console.log({tag})

    if (!tag) throw Error('No tag found you search by id :'+tag);
    await res.status(200).json(tag);

}

export const getTagById = async (req: IRequest, res: IResponse, next: NextFunction) => {
    await handle(getTagByIdHandler, 404)
    (req, res, next);
}


export const newTag = async (req: IRequest, res: IResponse, next: NextFunction) => {
    console.log("new tag in TagController ", req.body);
    try {
        // Validation
        //const { error, data } = validateTag(req.body);
        const {error, data} = req.body;
        if (error) {
            console.log("new tag validation fail");
            return res.status(400).json(error);
        }

        const tag = await tagService.newTag(req.body);

        if (!tag) {
            throw new Error('Cannot save tag');
        }

        res.status(201).json(tag);
    } catch (err) {
        console.log(err);
        res.status(400).json();
    }
};



export const updateTag = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let tagId = req.params['tagId'];

    // Validation
    //const { error, data } = validateTag(req.body);

    let tag = req.body;
    console.log(`new tag : ${tagId} `, req.body);
    try {
        const updateTag = await tagService.updateTag(tagId,tag);

        if (!updateTag) throw Error('Cannot update Tag');
        await res.status(200).json(updateTag);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}


export const deleteTag = async (req: IRequest, res: IResponse, next: NextFunction) => {
    let tagId = req.params['tagId'];

    try {
        const deletedTag = await tagService.deleteTag(tagId);

        if (!deletedTag) throw Error('Cannot delete tag');
        await res.status(200).json(deletedTag);

    } catch (err) {
        await res.status(400).json({message: err})
    }
}

