import * as path from 'path';
import { connection } from '../config/connection.js';
const dirname = import.meta.dirname;

export const indexFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'index.html'));
};

export const catFunc = (req, res) => {
    connection();
    res.status(200).sendFile(path.join(dirname, '..', "views", 'categoria.html'));  
};