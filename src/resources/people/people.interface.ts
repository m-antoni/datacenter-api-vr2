import { Document } from 'mongoose';

export default interface Post extends Document {
    _id: string;
    id: string;
    full_name: string;
    first_name: string;
    middle_initial: string;
    middle_name: string;
    last_name: string;
    linkedin_url: string;
    linkedin_username: string;
    location_name: string;
    location_country: string;
    location_continent: string;
    version_status: {};
}