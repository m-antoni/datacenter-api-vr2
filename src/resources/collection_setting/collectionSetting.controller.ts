import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import CollectionSettingService from './collectionSetting.service';


class CollectionSettingController implements Controller {
    public path = '/datacenter';
    public router = Router();
    private ColllectionSettingService = new CollectionSettingService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        // inject validation if needed
        this.router.get(`${this.path}/settings`, this.getSingleSetting);
        this.router.get(`${this.path}/settings/create-keys`, this.createKeysToMap);
    }

    /* Save keys of collection*/
    private createKeysToMap = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const data: any = await this.ColllectionSettingService.createKeysToMapService();

            res.status(201).json({ data });
        
        } catch (error) {
            console.log(error)
            next(new HttpException(400, 'Cannot map keys something went wrong.'));            
        }
    }

    /* Get one setting */
    private getSingleSetting = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            
            const { setting_name } = req.query as any;

            const data = await this.ColllectionSettingService.getSingleSettingService(setting_name);

            if(data == null) { next(new HttpException(400, 'Cannot get single setting, something went wrong.')) }

            res.status(200).json({ data }); 

        } catch (error) {
            console.log(error);
            next(new HttpException(400, 'Cannot get single setting, something went wrong.'))
        }
    }

 

}


export default CollectionSettingController;