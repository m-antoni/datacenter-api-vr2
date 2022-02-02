import { Document } from 'mongoose';

export default interface User extends Document {
    // email: string;
    username: string;
    name: string;
    password: string;
    role: string;

    isValidPassword(password: string): Promise<Error | boolean>;
}
