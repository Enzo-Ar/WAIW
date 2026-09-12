import * as path from 'path';
const dirname = import.meta.dirname;

export const indexFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'index.html'));
};

export const catFunc = async (req, res) => {
    //FAZER REQUEST GET DE PUXAR DEPENDENDO SE FOR FILME OU SE FOR SERIES OU CARTOONS
    // try {
    //     const result = await query("INSERT INTO filmes(nome, data_lanc, nota, comentario) VALUES ('Matrix', '1999-05-21', 4.5, 'bom filme, bem legal');");
    //     console.log(result);
    // } catch(err) {
    //     console.error(err);
    // } finally {
    //     await end();
    // }
    res.status(200).sendFile(path.join(dirname, '..', "views", 'categoria.html'));  
};

export const midiaFunc = (req, res) => {
    res.status(200).sendFile(path.join(dirname, '..', "views", 'midia.html'));
};