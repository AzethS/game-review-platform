import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,

    ROOT_DOMAIN_URL: 'dummy',
    dataApiUrl: 'dummy',
    jwtSecret: 'password',

    MONGO_DB_CONNECTION_STRING: 'dummy'
};
