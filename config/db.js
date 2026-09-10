import clientOpt from './clientOpt.js';
import { Pool } from 'pg';

//creates a new pool to connect with the database
const pool = new Pool(clientOpt);

//exports a query func with when used returns the pool query method which is used to make requests to the database
//and the return is necessary for it to close automatically and give back the results since it returns a promise with the query results
export const query = (text, params) => {
    return pool.query(text, params)
};

//for the use of single clients to make mult transactions querys
export const connect = () => {
    return pool.connect();
}

//same thing but to close the pool
export const end = () => {
    return pool.end();
}