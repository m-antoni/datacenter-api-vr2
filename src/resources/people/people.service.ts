import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';
import SeachQuery from './interfaces/people.searchquery.interface';
import { link, number } from 'joi';
import SearchQuery from './interfaces/people.searchquery.interface';

enum SortBy {
    asc = 1,
    desc = -1
}

class PeopleService {
    
    private people = PeopleModel;
    private default_country = "united states" // default country for now

    /** Search User  */
    public async searchByUserService(args: SearchQuery) : Promise<Object> {
    
        let { summary, first_name, last_name, linkedin_url, job_title, job_company_name, search_text, sortby, options } = args; 

        let sortVal = sortby === "asc" ? SortBy.asc : SortBy.desc;

        let pipeline;

        try {

            if(linkedin_url || first_name)
            {
                pipeline = [
                    {
                        $match: { 
                            $or:[
                                {
                                    $and: [
                                        { location_country: this.default_country },
                                        { linkedin_url: linkedin_url }
                                    ],
                                    archive: { $exists: false }
                                },
                                {
                                   $and: [
                                        { location_country: this.default_country },
                                        { archive: { $exists: false } },
                                        { first_name: first_name },
                                        { last_name: last_name },
                                        { job_title: job_title },
                                        { job_company_name: job_company_name }
                                   ]
                                },
                            ],
                        }, 
                    },
                    { $sort: { full_name: sortVal }},
                ];
            }
            else if(search_text)
            {
                pipeline = [
                    { 
                        $match: {
                            $and: [
                                { location_country: this.default_country },
                                { archive: { $exists: false } },
                                { $text: { $search: search_text } }
                            ]
                        } 
                    },
                    { $sort : { _id: sortVal } },
                    { $project: { 
                            _id: 1,
                            linkedin_id: 1,
                            first_name: 1,
                            last_name: 1, 
                            full_name: 1, 
                            gender: 1,
                            industry: 1,
                            job_title: 1,
                            job_company_name: 1,
                            location_continent: 1,
                            location_country: 1, 
                            linkedin_url: 1 
                        } 
                    }
                ];
            }
            else
            {
                pipeline = [
                    { $match: { 
                            location_country: this.default_country,
                            archive: { $exists: false }
                        } 
                    },
                    { $sort: { _id: sortVal } },
                    { $project: {
                            _id: 1,
                            linkedin_id: 1,
                            first_name: 1,
                            last_name: 1, 
                            full_name: 1, 
                            gender: 1,
                            industry: 1,
                            job_title: 1,
                            job_company_name: 1,
                            location_continent: 1,
                            location_country: 1, 
                            linkedin_url: 1 
                        } 
                    }
                ];
            }
         
            const aggregate = this.people.aggregate(pipeline);

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, options)

            return aggregatePaginate;

        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }

    
    /** Insert And Update User Data */
    public async insertAndUpdateUserService(args: People): Promise <Object | void> {
        try {
            
            const identifier = { linkedin_url: args.linkedin_url };

            let updateValues: any = {
                $set: {
                    image: args.image,
                    first_name: args.first_name,
                    middle_name: args.middle_name,
                    middle_initial: args.middle_initial,
                    last_name: args.last_name,
                    full_name: args.full_name,
                    gender: args.gender,
                    linkedin_url: args.linkedin_url,
                    linkedin_username: args.linkedin_username,
                    linkedin_id: args.linkedin_id,
                    industry: args.industry,
                    job_title: args.job_title,
                    job_company_name: args.job_company_name,
                    job_company_location_country: args.job_company_location_country,
                    job_company_location_continent: args.job_company_location_continent,
                    location_continent: args.location_continent,
                    location_country: args.location_country,
                    emails: args.emails,
                    phone_numbers: args.phone_numbers,
                    mobile_numbers: args.mobile_numbers
                },
                $addToSet: {}, // this will update existing array or set a new 
            }

            if(args.skills && args.skills.length > 0){
                updateValues['$addToSet']['skills'] = { $each: args.skills };
            }
            if(args.profiles && args.profiles.length > 0){
                updateValues['$addToSet']['profiles'] = { $each: args.profiles };
            }
            if(args.education && args.education.length > 0){
                updateValues['$addToSet']['education'] = { $each: args.education };
            }
            if(args.interest && args.interest.length > 0){
                updateValues['$addToSet']['interest'] = { $each: args.interest };
            }
            if(args.experience && args.experience.length > 0){
                updateValues['$addToSet']['experience'] = { $each: args.experience };
            }

            // Insert or Update
            const insertOrUpdate = await PeopleModel.findOneAndUpdate(
                                                        identifier, 
                                                        updateValues , 
                                                        { upsert: true, new: true } 
                                                    );

            return insertOrUpdate;

        } catch (error) {
            console.log(error)
        }
    }


    /** Archived Or Restore User by linkedin_url */
    public async archivedOrRestoreUserService(args: any): Promise <Object | any> {
        
        try {
        
            const filter = { linkedin_url: args.linkedin_url };

            let update;

            if(args.type === 'restore'){
                update = { $unset: { archive: 1 }};
            }
            
            if(args.type === 'archive'){
                update = { $set: { archive: true  }};
            }

            const options = { new: true };

            // const result = await PeopleModel.deleteOne({ linkedin_url });
            const result = await PeopleModel.findOneAndUpdate(filter, update, options);

            return result;

            
        } catch (error) {
            console.log(error)
        }
    }



    /** Get All Archive User  */
    public async getArchiveUserService(args: SearchQuery) : Promise<Object> {
    
        let { sortby, options } = args; 

        let sortVal = sortby === "asc" ? SortBy.asc : SortBy.desc;

        try {

            let pipeline = [
                { 
                    $match: { 
                        location_country: this.default_country,
                        archive: true
                    } 
                },
                { $sort: { _id: sortVal } },
                { $project: {
                        _id: 1,
                        linkedin_id: 1,
                        first_name: 1,
                        last_name: 1, 
                        full_name: 1, 
                        gender: 1,
                        industry: 1,
                        job_title: 1,
                        job_company_name: 1,
                        location_continent: 1,
                        location_country: 1, 
                        linkedin_url: 1 
                    } 
                }
            ];
         
            const aggregate = this.people.aggregate(pipeline);

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, options)

            return aggregatePaginate;

        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }


}

export default PeopleService;