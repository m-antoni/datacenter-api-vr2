import peopleModel from "../people/people.model";
import CollectionSettingI from "./collectionSetting.interface";
import CollectionSettingModel from "./collectionSetting.model";


class CollectionSettingService {
    
    private collection_setting = CollectionSettingModel;
    private people = peopleModel;

    /** Save all the available keys for Import User  */
    public async createKeysToMapService() : Promise <Object | void> {
        
        try {

            // Check if current setting is existing
            const existing =  await this.collection_setting.findOne({ setting_name: 'collection-keys' });

            if(existing){
                return { data: null, message: 'collection-keys is already created, no need to run.'};
            }

            /* Pipeline to get all the keys in collection */
            let pipeline = [
                { 
                    "$project": {
                        "data": { "$objectToArray": "$$ROOT" }
                    }},
                    { 
                        "$project": { 
                            "data": "$data.k" 
                        }
                    },
                    { "$unwind": "$data" },
                    { "$group": {
                        "_id": null,
                        "keys": { 
                            "$addToSet": "$data" 
                        }
                    }
                }
            ];

            const aggregate = await this.people.aggregate(pipeline);

            const keys: [] = aggregate[0]['keys'];

            // filter w/o _id,id,version_status,archive
            const filterKeys = <never[] | []>keys.filter((val:any) => (val !== "_id" && val !== "id" && val !== "archive" && val !== "version_status"));
            
            const params = {
                setting_name: "collection-keys",
                keys: filterKeys.sort(),
                description: "collection keys"
            };

            /* save  keys */
            const createData = await this.collection_setting.create(params);

            return createData;

        } catch (error) {
            console.log(error)
            throw new Error('Unable to save keys');
        }
    }


    /** Get only one specific settings by name*/
    public async getSingleSettingService(setting_name: string) : Promise <Object | null> {
        
        try {
            
            const setting = await this.collection_setting.findOne({ setting_name: setting_name });

            return setting;

        } catch (error) {
            console.log(error);
            throw new Error('Unable to get setting by name');
            
        }
    
    }


}

export default CollectionSettingService;