import { Document } from 'mongoose';

export default interface CollectionSettingI extends Document {
    setting_name: string;
    keys: [];
    description: string;
    archive?: boolean
}