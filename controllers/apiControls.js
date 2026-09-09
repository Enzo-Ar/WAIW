import { query, end } from '../config/db.js';
const dirname = import.meta.dirname;

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
        } finally {
            await end();
        }
    } else {
        res.sendStatus(404);
    }
    
};