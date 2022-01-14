import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';

interface ExactContinent {
    exact: string | undefined
}

class PeopleService {
    
    private people = PeopleModel;

    /** Get Location Continent API*/
    public async getLocationContinent(exact_continent: string | undefined) : Promise<Object | undefined>{
        try {
            
            let pipeline;

            console.log(exact_continent)

            if(exact_continent)
            {
                pipeline = [
                    { 
                        $match: { 
                            location_continent: exact_continent 
                        }
                    },
                    {
                        $group: { 
                            _id: null, 
                            location_continent: { $sum: 1 } 
                        } 
                    },
                    { 
                        $project: { 
                            _id: 0, 
                            location_continent: exact_continent, 
                            total: "$location_continent"
                        } 
                    }
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
                                        { "location_continent": "north america"},
                                        { "location_continent": "south america"}
                                    ]
                               }
                           ]
                        } 
                    },
                    { 
                        $group: {
                            _id: "$location_continent", 
                            total: { $sum: 1 } 
                        } 
                    },
                    { 
                        $sort : { total: -1 } 
                    },
                    { 
                        $project: { 
                            _id: 0, 
                            location_continent: "$_id", 
                            total_counts: "$total" 
                        } 
                    }
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
    
            const result = await this.people.aggregate(pipeline);

            return result;
            
        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }


    /** Search User  */
    public async searchByUserService(linkedin_url: string) : Promise<Object> {
    
        let pipeline = [
            {
                $match: { 
                    linkedin_url: linkedin_url          
                 } 
            }
        ];

        try {
            
            const result = await this.people.aggregate(pipeline);

            return result;

        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }

    
    /** Search User by Countries  */
    public async searchUserByCountryService(search_country: string): Promise<Object> {
        
        try {
            
            let pipeline;

            // if(search_country)
            // {
               
            // }
            // else
            // {
            //     pipeline = [
            //         { $unwind: "$countries" },
            //         { $group: { _id: "$countries", total: { $sum: 1 } }},
            //         { $project: { _id: 0 , countries: "$_id", total: 1 } },
            //         { $sort: { total: -1 } } 
            //     ]
            // }

            let page = 2;
            let limit = 4;

            pipeline = [
                {
                    $match: { 
                        $and: [
                            {
                                $or: [
                                    { "location_continent": "north america"},
                                    { "location_continent": "south america"}
                                ]
                            }
                        ]
                    }, 
                },
                { 
                    $unwind: "$countries" 
                },
                { 
                    $group: { 
                        _id: { 
                            countries: "$countries", 
                            location_continent: "$location_continent" 
                        }, 
                        total: { $sum: 1 } 
                    }
                },
                {
                    $project: { _id: 0, countries: "$_id.countries", location_continent: "$_id.location_continent", total: 1 }
                },
                { 
                    $sort: { total: -1 } 
                }
            ]

            const aggregate = this.people.aggregate(pipeline);

            const options = {
                page: 4,
                limit: 2,
            };

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, options);

            console.log(aggregatePaginate);

            return aggregatePaginate;
            

        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }
    

}


export default PeopleService;