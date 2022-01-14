"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var envalid_1 = require("envalid");
function validateEnv() {
    envalid_1.cleanEnv(process.env, {
        NODE_ENV: envalid_1.str({
            choices: ['development', 'production'],
        }),
        MONGO_PASSWORD: envalid_1.str(),
        MONGO_PATH: envalid_1.str(),
        MONGO_USER: envalid_1.str(),
        PORT: envalid_1.port({ default: 5000 }),
    });
}
exports.default = validateEnv;
