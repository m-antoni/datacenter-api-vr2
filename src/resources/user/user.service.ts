import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(name: string,username: string, password: string, role: string): Promise<string | Error> {
        try {
            const user = await this.user.create({ name, username, password, role,});

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Attempt to login a user
     */
    public async login(username: string, password: string): Promise<Object | Error> {
        try {
            const user = await this.user.findOne({ username });

            if (!user) {
                throw new Error('Unable to find user with that username');
            }

            if (await user.isValidPassword(password)) {

                const userDetails = await this.user.findOne({ username }, { _id: 0, password: 0 });

                const data = {
                    token: token.createToken(user),
                    user: userDetails
                }

                return data;

            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }
}

export default UserService;
