import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import PeopleController from './resources/people/people.controller';
import CollectionSettingController from './resources/collection_setting/collectionSetting.controller';
// import PostController from '@/resources/post/post.controller';
// import UserController from '@/resources/user/user.controller';

validateEnv();

const PEOPLE_CONTROLLER = new PeopleController();
const COLLECTION_SETTING_CONTROLLER = new CollectionSettingController();

const app = new App(
    [
        PEOPLE_CONTROLLER,
        COLLECTION_SETTING_CONTROLLER
    ],
    Number(process.env.PORT)
);

app.listen();
