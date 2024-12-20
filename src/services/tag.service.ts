import TagService, { ITag } from '../model/tag.service';
import { GetQueryForPagination } from './GetQueryForPagination';

//before
export const getAllTag = async (): Promise<ITag[]> => {
  return TagService.find().exec();
};

//================================================================================================================================
//After updating
export const getAllTagsWithPagination = async (
  query: GetQueryForPagination,
): Promise<{ data: ITag[]; total: number }> => {
  const { page, limit, search, sortBy, sortOrder } = query;

  // Create the base match query
  const matchQuery: any = {};

  const searchQuery = search
    ? {
        $or: [{ name: { $regex: search, $options: 'i' } }],
      }
    : {};

  const sortQuery = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : {};

  const [data, total] = await Promise.all([
    TagService.find(searchQuery)
      .sort(sortQuery as { [key: string]: 1 | -1 }) // Type assertion here
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    TagService.countDocuments(searchQuery).exec(),
  ]);

  return { data, total };
};

//================================================================================================================================

export const getTagById = async (tagId: string): Promise<ITag | null> => {
  return TagService.findById(tagId).exec();
};

export const newTag = async (tag: ITag): Promise<ITag> => {
  const newTag = new TagService(tag);
  return newTag.save();
};

export const updateTag = async (tagId: string, tag: ITag): Promise<ITag> => {
  const newTag = <ITag>(
    await TagService.findByIdAndUpdate(tagId, tag, { new: true })
  );

  //return newDisease as IPatient;   //   This way  works  also.
  return newTag;
};

export const deleteTag = async (tagId: String): Promise<ITag> => {
  const deletedTag = await TagService.findByIdAndDelete(tagId);

  return deletedTag as ITag;
};
