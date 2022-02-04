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
    
        let { first_name, last_name, linkedin_url, job_title, job_company_name, search_text, sortby, options } = args; 

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
                    { $sort: { _id: sortVal }},
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
                    work_email: args.work_email,
                    phone_numbers: args.phone_numbers,
                    mobile_numbers: args.mobile_numbers,
                    mobile_number: args.mobile_number,
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

      
    /** Insert Imported JSON from excel/csv */
    public async insertExcelDataService (args: SearchQuery): Promise<Object>{

        let { excel_data, columns_to_fields } = args;

        try {
        
            const typeArrayFields = ["emails", "phone_numbers", "mobile_numbers","experience", "skills", "interest", "profiles", "education"];

            let finalArr:any = [];
            let linkedin_url_arr:any = [];

            if(excel_data && columns_to_fields)
            {
                // map through excel data
                excel_data.map((excel, index) => 
                {   
                    let newObj: any = {};
                    // get the key and val
                    for (const [key, val] of Object.entries(excel)) 
                    {
                        // compare the key and column here to set field and values to store
                        columns_to_fields.map((col: any) => {
                            // console.log("ROOT", col, val)
                            if(col.column === key)
                            {   
                                
                                if(col.set_field === "linkedin_url")
                                {   
                                    if(!linkedin_url_arr.includes(val)){
                                        linkedin_url_arr.push(val);
                                    }
                                }

                                if(val === "")
                                {
                                    newObj[col.set_field] = ""; //  empty cell in column
                                }
                                else if(typeArrayFields.includes(col.set_field))
                                {
                                    let strVal = val;
                                    if(strVal != ""){
                                        newObj[col.set_field] = (<string>strVal).toString().split(","); // creating objects field:value
                                    }else{
                                        newObj[col.set_field] = "";
                                    }
                                    console.log('RUN 2')
                                }
                                else
                                {
                                    console.log('RUN 3')
                                    newObj[col.set_field] = val; // creating objects field:value
                                }
                            }
                        })

                        // add field:value default by united states
                        newObj["location_country"] = this.default_country;
                    }

                    finalArr.push(newObj);
               })
    
            //    console.log(finalArr)
            }

            // params to return
            let data: any  = {
                linkedin_urls: [],
                inserts: [],
            };
      
            // Validate Excel Data by linkedin_url
            if(linkedin_url_arr.length > 0){
                let exists = await this.people.find({ "linkedin_url": { "$in": linkedin_url_arr } }, { linkedin_url: 1 });
                if(exists.length > 0){   
                    data.linkedin_urls = exists;
                    return data;
                }
            }
            
            // Insert All the excel data
            const insertParams: Array<any> = finalArr;
            const insertMany = await this.people.insertMany(insertParams);

            data.inserts = insertMany;
            return data;

        } catch (error) {
            console.log(error);
            throw new Error('Unable to save imported data');
        }
    }


}

export default PeopleService;