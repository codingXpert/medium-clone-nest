import ormconfig from './ormconfig';

const ormseedconfig = {
    ...ormconfig,
    migrations: ['src/seeds/*.ts']  //[__dirname + 'src/seeds/*.ts']
};
export default ormseedconfig;