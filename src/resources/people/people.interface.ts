import { string } from 'joi';
import { Document } from 'mongoose';

export default interface Post extends Document {
    _id?: string;
    id?: string;
    image?: string
    full_name?: string;
    first_name?: string;
    middle_initial?: string;
    middle_name?: string;
    last_name?: string;
    gender?: string;
    linkedin_url?: string;
    linkedin_username?: string;
    linkedin_id?: string;
    industry?: string;
    job_title?: string;
    job_company_id?: string;
    job_company_name?: string;
    job_company_size?: string;
    job_company_linkedin_url?: string;
    job_company_linkedin_id?: string;
    job_company_location_name?: string;
    job_company_location_region?: string;
    job_company_location_geo?: string;
    job_company_location_postal_code?: string;
    job_company_location_country?: string;
    job_company_location_continent?: string;
    job_start_date?: string;
    job_summary?: string;
    linkedin_connections?: number;
    summary?: string;
    phone_numbers?: [];
    mobile_numbers?: [];
    emails?: [];
    telephone_numbers?: [];
    skills?: string[];
    location_name?: string;
    location_country?: string;
    location_continent?: string;
    interest?: string[];
    experience?: [];
    education?: [];
    profiles?: [];
    version_status?: {};
    archive?: boolean;
}