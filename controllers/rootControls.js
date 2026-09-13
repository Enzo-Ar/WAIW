import * as path from 'path';
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

export const loginviewFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'login.html'));
}

export const loginpostFunc = (req, res) => {
    console.log(req.body.email);
    console.log(req.body.senha);
}