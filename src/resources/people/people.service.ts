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
                console.log("single user block")

                pipeline = [
                    {
                        $match: { 
                            // $and: [
                            //     { location_country: this.default_country },
                            //     { linkedin_url: linkedin_url }
                            // ]
                            $or:[
                                {
                                    $and: [
                                        { location_country: this.default_country },
                                        { linkedin_url: linkedin_url }
                                    ]
                                },
                                {
                                   $and: [
                                        { location_country: this.default_country },
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
                console.log("search_text block")

                pipeline = [
                    { 
                        $match: {
                            $and: [
                                { location_country: this.default_country },
                                { $text: { $search: search_text } }
                            ]
                        } 
                    },
                    { $sort : { _id: sortVal } },
                    { $project: { 
                            _id: 1,
                            linkedin_id: 1,
                            gender: 1,
                            full_name: 1, 
                            location_continent: 1,
                            location_country: 1, 
                            linkedin_url: 1 
                        } 
                    }
                ];
            }
            else
            {
                console.log("user list block")

                pipeline = [
                    { $match: { location_country: this.default_country } },
                    { $sort: { _id: sortVal } },
                    { $project: { 
                            _id: 1,
                            full_name: 1,
                            linkedin_id: 1,
                            gender: 1, 
                            linkedin_url: 1, 
                            location_continent: 1, 
                            location_country: 1 
                        } 
                    }
                ];
            }


            // if(summary === 'us')
            // {
            //     /*** Show summary total users in United States */
            //     pipeline = [
            //         { $match: { location_country: this.default_country } },
            //         { $group: { _id: "$location_country", total: { $sum: 1 } } },
            //         { $project: { _id: 0, location_country: "$_id", total_users: "$total" } }
            //     ];
            // }
         
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
                },
                $addToSet: {}, // this will update existing array or set a new 
            }

            // This are the arrays need to be updated if value is present in the request
            if(args.emails && args.emails.length > 0){
                updateValues['$addToSet']['emails'] = { $each: args.emails };
            }
            if(args.phone_numbers && args.phone_numbers.length > 0){
                updateValues['$addToSet']['phone_numbers'] = { $each: args.phone_numbers };
            }
            if(args.mobile_numbers && args.mobile_numbers.length > 0){
                updateValues['$addToSet']['mobile_numbers'] = { $each: args.mobile_numbers };
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


    /** Delete User by linkedin_url */
    public async deleteUserService(linkedin_url: string): Promise <Object | void> {
        
        try {
           
            const result = await PeopleModel.deleteOne({ linkedin_url });

            return result;

        } catch (error) {
            console.log(error)
        }
    }
}


export default PeopleService;