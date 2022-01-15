import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';
import SeachQuery from './interfaces/people.searchquery.interface';
import { link, number } from 'joi';
import SearchQuery from './interfaces/people.searchquery.interface';

interface ExactContinent {
    exact: string | undefined
}

enum Continent {
    NA = "na",
    SA = "sa",
    NORTH_AMERICA = "north america",
    SOUTH_AMERICA = "south america",
}

enum SortBy {
    asc = 1,
    desc = -1
}

class PeopleService {
    
    private people = PeopleModel;

    /** Search By Location */
    public async searchByLocationService(args: SeachQuery) : Promise<Object | undefined>{
        
        try {
            
            const { search_continent, search_country, sortby, options } = args; 
            let sortVal = sortby === "asc" ? SortBy.asc : SortBy.desc;
            let pipeline;
            
            if(search_continent != undefined)
            {
                // search must be valid enum continent
                if(search_continent === Continent.NA || search_continent === Continent.SA)
                {
                    const match_conditional = (search_continent === Continent.NA) ? 
                        { $match: { location_continent: Continent.NORTH_AMERICA } } : 
                        { $match: { location_continent: Continent.SOUTH_AMERICA } }
                    
                    pipeline = [
                        match_conditional,
                        { 
                            $group: { 
                                _id: { 
                                    countries: "$location_country", 
                                    continent: "$location_continent" 
                                }, 
                                total: { $sum: 1 }
                            }
                        },
                        { $sort: { total: sortVal } },
                        { $project: { _id: 0, location_country: "$_id.countries", location_continent: "$_id.continent", total: 1 } },
                    ];
                }
                else
                {
                    const data = { status: 404, message: "Invalid Continent" };
                    
                    return data;
                }
            }
            else if(search_country != undefined)
            {
                pipeline = [
                    {
                        $match: { 
                            $and: [{
                                $or: [
                                    { location_continent: Continent.NORTH_AMERICA },
                                    { location_continent: Continent.SOUTH_AMERICA }
                                ]
                            }],
                            location_country: args.search_country
                        }, 
                    },
                    { $sort: { full_name: sortVal }},
                    { $project: { _id: 0, full_name: 1, linkedin_url: 1, location_country: 1, location_continent: 1, }}
                ];
            }
            else
            {
                // Show Summary total user of North and South America
                pipeline = [
                    { 
                        $match: { 
                           $and: [
                               {
                                    $or: [
                                        { location_continent: Continent.NORTH_AMERICA},
                                        { location_continent: Continent.SOUTH_AMERICA}
                                    ]
                               }
                           ]
                        } 
                    },
                    { $group: { _id: "$location_continent", total: { $sum: 1 } } },
                    { $sort : { total: sortVal } },
                    { $project: { _id: 0, location_continent: "$_id", total: "$total" } }
                ];

                /** Aggregate Pipeline for getting all of the users total group by location_continent **/

                // pipeline = [
                //     { 
                //         $match: { 
                //             "location_continent": { $ne: null } 
                //         } 
                //     },
                //     { 
                //         $group:{ 
                //             _id: "$location_continent", total: { $sum: 1 } 
                //         } 
                //     },
                //     { 
                //         $sort : { total: -1 } 
                //     },
                //     { 
                //         $project: { 
                //             _id: 0, location_continent: "$_id", 
                //             total: "$total" 
                //         } 
                //     }
                // ];

            }
    
            const aggregate = this.people.aggregate(pipeline);

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, options);

            return aggregatePaginate;
            
        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }


    /** Search User  */
    public async searchByUserService(args: SearchQuery) : Promise<Object> {
    
        let { linkedin_url, search_text, sortby, options } = args; 

        let sortVal = sortby === "asc" ? SortBy.asc : SortBy.desc;

        let pipeline;


        try {

            if(linkedin_url)
            {
                pipeline = [
                    {
                        $match: { 
                            $and: [{
                                $or: [
                                    { location_continent: Continent.NORTH_AMERICA },
                                    { location_continent: Continent.SOUTH_AMERICA }
                                ]
                            }],
                            linkedin_url: linkedin_url
                        }, 
                    },
                    { $sort: { full_name: sortVal }},
                ];
            }
            else if(search_text)
            {
                pipeline = [
                    { $match: {
                        $and: [{
                            $or: [
                                { location_continent: Continent.NORTH_AMERICA },
                                { location_continent: Continent.SOUTH_AMERICA }
                            ]
                        }],
                        $text: { $search: search_text } } 
                    },
                    { $sort : { full_name: sortVal } },
                    { $project: { _id: 0, full_name: 1, location_continent: 1, linkedin_url: 1 } }
                ];
            }
            else
            {
                pipeline = [
                    { 
                        $match: { 
                           $and: [
                               {
                                    $or: [
                                        { location_continent: Continent.NORTH_AMERICA},
                                        { location_continent: Continent.SOUTH_AMERICA}
                                    ]
                               }
                           ]
                        } 
                    },
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

        // try {

        //     // { $text: { $search: search_text } }
            
        //     pipeline = [ 
        //             { 
        //                 $match: { linkedin_url: linkedin_url }  
        //             }
        //             // { $sort : { _id: sortVal } },
        //     ];
            
        //     const aggregate = await this.people.aggregate(pipeline);

        //     // const aggregatePaginate = await this.people.aggregatePaginate(aggregate, options);
        
        //     return aggregate;

        

        // } catch (error) {
        //     console.log(error)
        //     throw new Error('Unable to get data');
        // }
    }

    
}


export default PeopleService;