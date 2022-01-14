import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';
import SeachQuery from './interfaces/people.searchquery.interface';

interface ExactContinent {
    exact: string | undefined
}

enum Continent {
    NA = "na",
    SA = "sa",
    NORTH_AMERICA = "north america",
    SOUTH_AMERICA = "south america",
}

class PeopleService {
    
    private people = PeopleModel;

    /** Get Location Continent API*/
    public async getLocationContinent(args: SeachQuery) : Promise<Object | undefined>{
        try {
            
            let pipeline;

            if(args.search != undefined)
            {
                // search must be valid enum continent
                if(args.search === Continent.NA || args.search === Continent.SA)
                {
                    const match_conditional = (args.search === Continent.NA) ? 
                        { $match: { location_continent: Continent.NORTH_AMERICA } } : 
                        { $match: { location_continent: Continent.SOUTH_AMERICA } }

                    pipeline = [
                        match_conditional,
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
                            $project: { _id: 0, country: "$_id.countries", location_continent: "$_id.location_continent", total: 1 }
                        },
                        { 
                            $sort: { total: -1 } 
                        }
                    ];
                }
                else
                {
                    const data = { status: 404, message: "Invalid Continent" };
                    
                    return data;
                }
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
    
            const aggregate = this.people.aggregate(pipeline);

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, args.options);

            return aggregatePaginate;
            
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
    public async searchUserByCountryService(args: SeachQuery): Promise<Object> {
        
        try {
            
            let pipeline;

            if(args.search != undefined)
            {
                pipeline = [
                    {
                        $match: { 
                            $and: [
                                {
                                    $or: [
                                        { location_continent: Continent.NORTH_AMERICA },
                                        { location_continent: Continent.SOUTH_AMERICA }
                                    ]
                                }
                            ],
                            countries: {
                                $in: [args.search]
                            }
                        }, 
                    },
                    {
                        $project: { _id: 0, full_name: 1, linkedin_url: 1, emails: 1, countries: 1, location_continent: 1,  }
                    },
                    { 
                        $sort: { total: -1 } 
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
                                        { location_continent: Continent.NORTH_AMERICA },
                                        { location_continent: Continent.SOUTH_AMERICA }
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
                        $project: { _id: 0, country: "$_id.countries", location_continent: "$_id.location_continent", total: 1 }
                    },
                    { 
                        $sort: { total: -1 } 
                    }
                ];   
            }


            const aggregate = this.people.aggregate(pipeline);

            const aggregatePaginate = await this.people.aggregatePaginate(aggregate, args.options);

            return aggregatePaginate;

        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }
    
}


export default PeopleService;