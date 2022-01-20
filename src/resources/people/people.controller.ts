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
        this.router.post(`${this.path}/user`, this.insertAndUpdateUser);
        this.router.delete(`${this.path}/user/delete`, this.deleteUser);
    }

    private searchByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { first_name, last_name, linkedin_url, search_text, page, limit, sortby = 'desc' } = req.query as any;

            const searchParams: SearchQuery = {
                linkedin_url,
                search_text,
                sortby,
                options: {
                    page,
                    limit,
                }
            }

            if(linkedin_url && search_text) { next(new HttpException(400, 'Invalid parameters given')); }

            const data: any = await this.PeopleService.searchByUserService(searchParams);
            
            if(data.docs.length === 0){

                res.status(404).json({ status: 404, message: "User not found" })
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


    /** Delete User by linkedin_url */
    private deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { linkedin_url } = req.body;

            const data: any = await this.PeopleService.deleteUserService(linkedin_url);

            if(data.deletedCount === 0) {
                res.status(200).json({ status: 404, message: "User is not found, cannot be deleted." });
            }else{
                res.status(200).json({ status: 200, message: "User deleted successfully" });
            }
        
        } catch (error) {
            console.log(error);
            next(new HttpException(400, 'Cannot delete this user, something went wrong'));
        }
    }

}


export default PeopleController;