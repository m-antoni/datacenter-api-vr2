import { Router, Request, Response, NextFunction } from 'express';
import queryString from 'querystring';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PeopleService from '@/resources/people/people.service';
import People from '@/resources/people/people.interface';


interface SearchUser {
    first_name: string;
    last_name: string;
    linkedin_url: string;
}

class PeopleController implements Controller {
    public path = '/peoples';
    public router = Router();
    private PeopleService = new PeopleService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        // inject validation if needed
        this.router.get(`${this.path}/continent`, this.getLocationContinent);
        this.router.get(`${this.path}/search`, this.searchByUser);
        this.router.get(`${this.path}/country`, this.searchUserByCountry);
    }

    private getLocationContinent = async (req: Request, res: Response, next: NextFunction ): Promise<Response | void> => {
        try {
            
            let exact_continent = req.query.exact?.toString();

            const data = await this.PeopleService.getLocationContinent(exact_continent);

            console.log(data);
            
            res.status(200).json({ data });

        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot get location continent'));
        }
    }

    private searchByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { first_name, last_name, linkedin_url } = req.query as any; // first_name and last_name is being pass but not priotity here

            if(linkedin_url)
            {
                const data = await this.PeopleService.searchByUserService(linkedin_url);

                res.status(200).json({ data });
            }
            else
            {
                res.status(400).json({ status: 400, message: "Please check your parameters" });
            }

         
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a search something went wrong.'));            
        }
    }

    
    private searchUserByCountry = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { search_country } = req.query as any;

            const data = await this.PeopleService.searchUserByCountryService(search_country);

            res.status(200).json({ data });
            
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a country search.'));            
        }
    }

    


}


export default PeopleController;