import * as express from 'express';
import { getCategorys, insertCatalogue } from '../../controllers/catalogueControls.js';
const router = express.Router();

router.route('/insert')
    .post(insertCatalogue);

router.route('/categorias')
    .get(getCategorys);
    
export default router;