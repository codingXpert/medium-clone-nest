import {  DataSourceOptions } from 'typeorm';
const config:  DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin@123',
  database: 'mediumClone'
};
export default config;
