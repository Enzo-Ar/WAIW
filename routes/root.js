import * as express from 'express';
const router = express.Router();

import { indexFunc, catFunc, midiaFunc } from '../controllers/rootControls.js';

router.route(['/', '/index{.html}'])
    .get(indexFunc);

router.route('/categoria{.html}')
    .get(catFunc);

router.route('/midia{.html}')
    .get(midiaFunc);

export default router;