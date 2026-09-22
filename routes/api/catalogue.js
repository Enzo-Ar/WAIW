import * as express from 'express';
import { insertCatalogue } from '../../controllers/catalogueControls.js';
const router = express.Router();

router.route('/insert')
    .post(insertCatalogue);

export default router;