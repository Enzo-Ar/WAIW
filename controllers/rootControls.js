import * as path from 'path';
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from '../exceptions/RequestError.js';
const dirname = import.meta.dirname;

export const indexFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'index.html'));
};

export const catFunc = async (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'categoria.html'));  
};

export const midiaFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'midia.html'));
};

export const signviewFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'signup.html'));
};

export const loginviewFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'login.html'));
};
