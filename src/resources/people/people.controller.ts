import { Router, Request, Response, NextFunction } from 'express';
import queryString from 'querystring';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PeopleService from '@/resources/people/people.service';
import SearchQuery from './interfaces/people.searchquery.interface';


interface SearchUser {
    first_name: string;
    last_name: string;
    linkedin_url: string;
}

class PeopleController implements Controller {
    public path = '/datacenter';
    public router = Router();
    private PeopleService = new PeopleService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        // inject validation if needed
        this.router.get(`${this.path}/user`, this.searchByUser);
        this.router.get(`${this.path}/user/archive`, this.getAllArchiveUser);
        this.router.post(`${this.path}/user`, this.insertAndUpdateUser);
        this.router.post(`${this.path}/user/archive-or-restore`, this.archivedOrRestoreUser);
        this.router.post(`${this.path}/user/insert-excel`, this.insertExcelData);
    }

    private searchByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { first_name, last_name, job_title, job_company_name, linkedin_url, search_text, page, limit, sortby = 'desc', archive } = req.query as any;

            const searchParams: SearchQuery = {
                linkedin_url,
                first_name,
                last_name,
                job_title,
                job_company_name,
                search_text,
                sortby,
                archive, 
                options: {
                    page,
                    limit,
                }
            }

            if(linkedin_url && search_text) { next(new HttpException(400, 'Invalid parameters given')); }

            const data: any = await this.PeopleService.searchByUserService(searchParams);
            
            if(data.docs.length === 0){
                // requested by ms teff success if data is null 
                res.status(200).json({ data: [], message: "User not found" })
            }else{
                res.status(200).json({ data });
            }
         
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a search something went wrong.'));            
        }
    }

    /** Insert And Update User Data */
    private insertAndUpdateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            let args = req.body;

            const data = await this.PeopleService.insertAndUpdateUserService(args);

            res.status(200).json({ data });

        } catch (error) {
             console.log(error)
            next(new HttpException(400, 'User Cannot insert or updated, something went wrong'));  
        }
    }


    /** Archived Or Restore User by linkedin_url */
    private archivedOrRestoreUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { linkedin_url, type } = req.body;
    
            const params = {
                linkedin_url,
                type
            }

            const data: any = await this.PeopleService.archivedOrRestoreUserService(params);

            if(data === null) {
                next(new HttpException(400, 'Cannot arhived or restore this user, something went wrong'));
            }else{
                res.status(200).json({ status: 200, data, message: `User is ${type} successfully` });
            }
        
        } catch (error) {
            console.log(error);
            next(new HttpException(400, 'Cannot arhived or restore this user, something went wrong'));
        }
    }


    /* Get All Archive Users */
    private getAllArchiveUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { page, limit, sortby = 'desc', archive } = req.query as any;

            const searchParams: SearchQuery = {
                sortby,
                options: {
                    page,
                    limit,
                }
            }

            const data: any = await this.PeopleService.getArchiveUserService(searchParams);
            
            res.status(200).json({ data });
         
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a search something went wrong.'));            
        }
    }


    /** Insert Imported JSON from excel/csv */
    private insertExcelData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

        try {

            const { excel_data, columns_to_fields } = req.body;

            const insertParams: SearchQuery = {
                excel_data,
                columns_to_fields
            }

            const data = await this.PeopleService.insertExcelDataService(insertParams);

            res.status(201).json(data);

        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot save excel data.'));
        }
    }



}



export default PeopleController;