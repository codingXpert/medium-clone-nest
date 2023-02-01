import {  DataSourceOptions } from 'typeorm';
const config:  DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin@123',
  database: 'mediumClone'  ,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,

};
export default config;
