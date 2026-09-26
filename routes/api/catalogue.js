import * as express from 'express';
import { getCategorys, insertCatalogue, updateCatalogue } from '../../controllers/catalogueControls.js';
const router = express.Router();

router.route('/insert')
    .post(insertCatalogue);

router.route('/update')
    .post(updateCatalogue);

//POR FAVOR FAZER FUNÇÃO DE CHECAR PARAMETROS EU NUM AGUENTO MAIS

router.route('/categorias')
    .get(getCategorys);
    
export default router;