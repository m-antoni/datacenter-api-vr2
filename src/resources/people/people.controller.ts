import { Router, Request, Response, NextFunction } from 'express';
import queryString from 'querystring';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PeopleService from '@/resources/people/people.service';
import People from '@/resources/people/people.interface';
import SearchByCountry from './interfaces/people.searchquery.interface';


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
        this.router.get(`${this.path}/location`, this.searchByLocation);
        this.router.get(`${this.path}/user`, this.searchByUser);
        this.router.post(`${this.path}/user`, this.insertAndUpdateUser);
    }

    private searchByLocation = async (req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            
            const { search_continent, search_country, page, limit, sortby = 'desc' } = req.query as any;

            if(search_continent && search_country) { next(new HttpException(400, 'Invalid parameters given')); }
 
            const searchParams: SearchByCountry = {
                search_continent,
                search_country,
                sortby,
                options: {
                    page,
                    limit,
                }
            }

            const data: any = await this.PeopleService.searchByLocationService(searchParams);
            
            if(data.status){
                res.status(data.status).json({ data });
            }

            res.status(200).json({ data });

        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot get location continent'));
        }
    }   


    private searchByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { first_name, last_name, linkedin_url, search_text, page, limit, sortby = 'desc' } = req.query as any;

            const searchParams: SearchByCountry = {
                linkedin_url,
                search_text,
                sortby,
                options: {
                    page,
                    limit,
                }
            }

            if(linkedin_url && search_text) { next(new HttpException(400, 'Invalid parameters given')); }

            const data = await this.PeopleService.searchByUserService(searchParams);
            
            res.status(200).json({ data });


            // if(linkedin_url || search_text)
            // {
            //     const data = await this.PeopleService.searchByUserService(searchParams);
            //     res.status(200).json({ data });
            // }
            // else
            // {
            //     res.status(400).json({ status: 400, message: "Please check your parameters" });
            // }
         
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a search something went wrong.'));            
        }
    }


    /** Insert User Data */
    private insertAndUpdateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            let args = req.body;

            const data = await this.PeopleService.insertAndUpdateUserService(args);

            res.status(200).json({ data });

        } catch (error) {
             console.log(error)
            next(new HttpException(400, 'Cannot insert something went wrong'));  
        }
    }


}


export default PeopleController;