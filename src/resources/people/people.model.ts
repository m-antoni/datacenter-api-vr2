import { Schema, model, AggregatePaginateModel, PaginateOptions, AggregatePaginateResult, Document } from 'mongoose';
import People from '@/resources/people/people.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const PeopleSchema = new Schema(
    {
        id: String,
        full_name: String,
        first_name: String,
        middle_initial: String,
        middle_name: String,
        last_name: String,
        gender: String,
        linkedin_url: String,
        linkedin_username: String,
        linkedin_id: String,
        industry: String,
        job_title: String,
        job_company_id: String,
        job_company_name: String,
        job_company_size: String,
        job_company_linkedin_url: String,
        job_company_linkedin_id: String,
        job_company_location_name: String,
        job_company_location_region: String,
        job_company_location_geo: String,
        job_company_location_postal_code: String,
        job_company_location_country: String,
        job_company_location_continent: String,
        job_start_date: String,
        job_summary: String,
        linkedin_connections: Number,
        summary: String,
        location_name: String,
        location_country: String,
        location_continent: String,
        image: String,
        emails: [],
        work_email: String,
        phone_numbers: [], // this is telephone
        mobile_numbers: [], // added phone 
        mobile_number: String,
        experience: [],
        education: [],
        profiles: [],
        interest: [],
        skills: [],
        version_status: {},
        archive: Boolean
    },
    {
        versionKey: false // get rid of _v:0 field
    },
    // { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } } // uncomment this once done inserting
)

PeopleSchema.plugin(aggregatePaginate);

interface PeopleModel<T extends Document> extends AggregatePaginateModel<T> {  }

export default model<People>('People', PeopleSchema) as PeopleModel<People>;
