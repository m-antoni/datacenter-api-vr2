import { Schema, model, AggregatePaginateModel, Document } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import CollectionSettingI from './collectionSetting.interface';

const CollectionSettingSchema = new Schema(
    {
        setting_name: String,
        keys: [],
        description: String,
        archive: Boolean
    },
    {
        versionKey: false // get rid of _v:0 field
    }
)

CollectionSettingSchema.plugin(aggregatePaginate);

interface PeopleModel<T extends Document> extends AggregatePaginateModel<T> {  }

export default model<CollectionSettingI>('collection_settings', CollectionSettingSchema) as PeopleModel<CollectionSettingI>;
