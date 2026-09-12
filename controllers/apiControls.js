import { query, connect, end } from '../config/db.js';

export const getData = async (req, res) => {
    const tipo = req.params.tipo;
    const queryStr = tipo === "filmes" ? 'SELECT * FROM filmes;' : tipo === "series" ? 'SELECT * FROM series;' : tipo === "cartoons" ? "SELECT * FROM cartoons;" : "void";

    if (queryStr !== "void") {
        try {
            const result = await query(queryStr);
            res.status(200).json(result.rows);
        } catch(err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }
    
};

export const getSingular = async (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    const queryStr = tipo === "filmes" || tipo === "series" || tipo === "cartoons" ? `SELECT * FROM ${tipo} WHERE id = $1` : "void";
    const replacers = [id];

    if (queryStr !== "void") {
        try {
            const result = await query(queryStr, replacers);
            console.log(result.rows);
            res.status(200).json(result.rows);
        } catch(err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }

}