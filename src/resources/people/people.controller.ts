import { Router, Request, Response, NextFunction } from 'express';
import queryString from 'querystring';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PeopleService from '@/resources/people/people.service';

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
        this.router.get(`${this.path}/search`, this.searchUser);
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

    private searchUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { first_name, last_name, linkedin, match_requirements } = req.query;

            

        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot make a search something went wrong.'));            
        }
    }

    
    
}


export default PeopleController;