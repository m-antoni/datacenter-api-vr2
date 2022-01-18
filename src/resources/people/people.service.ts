import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';
import SeachQuery from './interfaces/people.searchquery.interface';
import { link, number } from 'joi';
import SearchQuery from './interfaces/people.searchquery.interface';

interface ExactContinent {
    exact: string | undefined
}

enum SortBy {
    asc = 1,
    desc = -1
}

class PeopleService {
    
    private people = PeopleModel;
    private default_country = "united states" // default country for now

    /** Search User  */
    public async searchByUserService(args: SearchQuery) : Promise<Object> {
    
        let { summary, linkedin_url, search_text, sortby, options } = args; 

        let sortVal = sortby === "asc" ? SortBy.asc : SortBy.desc;

        let pipeline;
        
        try {

            if(linkedin_url)
            {
                pipeline = [
                    {
                        $match: { 
                            $and: [
                                { location_country: this.default_country },
                                { linkedin_url: linkedin_url }
                            ]
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
                                { $text: { $search: search_text } }
                            ]
                        } 
                    },
                    { $sort : { full_name: sortVal } },
                    { $project: { _id: 0, full_name: 1, location_continent: 1, location_country: 1, linkedin_url: 1 } }
                ];
            }
            else if(summary === 'us')
            {
                /**
                 * Show summary total users in United States
                 */
                 pipeline = [
                    { $match: { location_country: this.default_country } },
                    { $group: { _id: "$location_country", total: { $sum: 1 } } },
                    { $project: { _id: 0, location_country: "$_id", total_users: "$total" } }
                ];
            }
            else
            {
                pipeline = [
                    { $match: { location_country: this.default_country } },
                    { $sort: { full_name: sortVal } },
                    { $project: { _id: 0, full_name: 1, linkedin_url: 1, location_continent: 1, location_country: 1 } }
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


    public async insertAndUpdateUserService(args: People): Promise <Object | void> {
        try {
            
            const identifier = { linkedin_url: args.linkedin_url };
    

            const updateValues = { 
                full_name: args.full_name,
                first_name: args.first_name,
                last_name: args.last_name,
                linkedin_url: args.linkedin_url,
                location_continent: args.location_continent,
                location_country: args.location_country,
                $addToSet:{
                    emails: {
                        $each: args.emails
                    },
                    phone_numbers: {
                        $each: args.phone_numbers
                    },
                    skills: {
                        $each: args.skills
                    }
                },
            }
            
            const insertOrUpdate = await PeopleModel.findOneAndUpdate( identifier, updateValues, { upsert: true, new: true } );

            return insertOrUpdate;

        } catch (error) {
            console.log(error)
        }
    }



    
}


export default PeopleService;