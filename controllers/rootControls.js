import * as path from 'path';
const dirname = import.meta.dirname;

export const indexFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'index.html'));
};

export const catFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'categoria.html'));  
};