import * as path from 'path';
import { signup, login } from '../model/apiModel.js';
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

export const signpostFunc = async (req, res) => {
    const r = await signup(req.body.email, req.body.senha, req.body.senhaGlobal);
    res.send(r);
};

export const loginviewFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'login.html'));
};

export const loginpostFunc = async (req, res) => {
    const r = await login(req.body.email, req.body.senha);
    res.send(r);
};