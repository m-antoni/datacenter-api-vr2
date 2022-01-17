import { Document } from 'mongoose';

export default interface Post extends Document {
    _id?: string;
    id?: string;
    image?: string // not avaialbel in collection, but frontend will have this
    full_name?: string;
    first_name?: string;
    middle_initial?: string;
    middle_name?: string;
    last_name?: string;
    linkedin_url?: string;
    linkedin_username?: string;
    phone_numbers?: string[];
    emails?: [
        {
            type: string,
            address: string
        }
    ];
    skills?: string[];
    location_name?: string;
    location_country?: string;
    location_continent?: string;
    interest?: string[];
    version_status?: {};

}