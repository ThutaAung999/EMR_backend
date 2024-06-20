import Tag, {ITag} from '../model/Tag'


export const getAllTag = async (): Promise<ITag[]> => {
    return Tag.find().exec();
}

export const getTagById = async (tagId: string): Promise<ITag | null> => {

    return Tag.findById(tagId).exec();
}


export const newTag = async (tag: ITag): Promise<ITag> => {
    const newTag = new Tag(tag);
    return newTag.save();
};


export const updateTag = async (tagId: string, tag: ITag): Promise<ITag> => {
    const newTag = <ITag>await Tag.findByIdAndUpdate(tagId, tag, {new: true});

    //return newDisease as IPatient;   //   This way  works  also.
    return newTag;
}

export const deleteTag = async (tagId: String): Promise<ITag> => {
    const deletedTag = await Tag.findByIdAndDelete(tagId);

    return deletedTag as ITag;
}
