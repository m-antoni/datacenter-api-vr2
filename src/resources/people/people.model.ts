import { Schema, model, AggregatePaginateModel, PaginateOptions, AggregatePaginateResult, Document } from 'mongoose';
import People from '@/resources/people/people.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const PeopleSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: true
        },
        first_name: {
            type: String,
            required: true,
        },
        middle_initial: {
            type: String
        },
        middle_name: {
            type: String
        },
        last_name: {
            type: String,
        },
        linkedin_url: {
            type: String,
            required: true
        },
        linkedin_username: {
            type: String            
        },
        location_name: {
            type: String
        },
        location_country: {
            type: String
        },
        location_continent: {
            type: String
        },
        version_status: {
            status: {
                type: String
            },
            contains: [],
            previous_version: {
                type: String
            },
            current_version: {
                type: String
            }
        }
        
    }
)

PeopleSchema.plugin(aggregatePaginate);

interface PeopleModel<T extends Document> extends AggregatePaginateModel<T> {  }

export default model<People>('People', PeopleSchema) as PeopleModel<People>;
