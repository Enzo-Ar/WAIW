import * as express from 'express';
const router = express.Router();

import { indexFunc, catFunc } from '../controllers/rootControls.js';

router.route(['/', '/index{.html}'])
    .get(indexFunc);

router.route('/categoria{.html}')
    .get(catFunc);

export default router;