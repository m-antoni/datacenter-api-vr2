import { Schema, model, AggregatePaginateModel, PaginateOptions, AggregatePaginateResult, Document } from 'mongoose';
import People from '@/resources/people/people.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const PeopleSchema = new Schema(
    {
        id: {
            type: String,
        },
        full_name: {
            type: String
        },
        first_name: {
            type: String
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
        emails: [],
        phone_numbers: {
            type: Array,
            required: false
        },
        interest: {
            type: Array,
            required: false
        },
        skills: {
            type: Array,
            required: false
        },
        version_status: {}
    },
    {
        versionKey: false
    }
)

PeopleSchema.plugin(aggregatePaginate);

interface PeopleModel<T extends Document> extends AggregatePaginateModel<T> {  }

export default model<People>('People', PeopleSchema) as PeopleModel<People>;
