import { Schema, model } from 'mongoose';
import People from '@/resources/people/people.interface';

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


export default model<People>('People', PeopleSchema);