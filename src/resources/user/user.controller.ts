import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/datacenter';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register),this.register);
        this.router.post(`${this.path}/login`,validationMiddleware(validate.login),this.login);
        this.router.get(`${this.path}/auth-details`, authenticated, this.getUser);
    }

    private register = async (req: Request,res: Response,next: NextFunction): Promise<Response | void> => {
        try {
            const { name, username, password, role } = req.body;

            const token = await this.UserService.register(name, username, password, role);

            res.status(201).json({ token });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (req: Request,res: Response,next: NextFunction): Promise<Response | void> => {
        try {
            const { username, password } = req.body;

            const data: any = await this.UserService.login(username, password);

            res.status(200).json({ token: data.token, user: data.user });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (req: Request,res: Response,next: NextFunction): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    };
}

export default UserController;
