import PeopleModel from '@/resources/people/people.model';
import People from '@/resources/people/people.interface';

interface ExactContinent {
    exact: string | undefined
}

class PeopleService {
    
    private people = PeopleModel;

    /**
     * 
     *  Get API
     */
    public async getLocationContinent(exact_continent: string | undefined) : Promise<Object | undefined>{
        try {
            
            let pipeline;

            console.log(exact_continent)

            if(exact_continent)
            {
                pipeline = [
                    { $match: { location_continent: exact_continent }},
                    { $group: { _id: null, location_continent: { $sum: 1 } } },
                    { $project: { _id: 0, location_continent: exact_continent , total: "$location_continent"} }
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
                        $project: { 
                            _id: 0, 
                            location_continent: "$_id", 
                            total_counts: "$total" 
                        } 
                    }
                ];

                /**
                 * Aggregate Pipeline for getting all of the users total group by location_continent 
                 * */

                // pipeline = [
                //     { $match: { "location_continent": { $ne: null } } },
                //     { $group:{ _id: "$location_continent", total: { $sum: 1 } } },
                //     { $project: { _id: 0, location_continent: "$_id", total_counts: "$total" } }
                // ];
                
            }
    
            const result = await this.people.aggregate(pipeline);

            return result;
            
        } catch (error) {
            console.log(error)
            throw new Error('Unable to get data');
        }
    }


    /**
     * Search User 
     */
 

}


export default PeopleService;