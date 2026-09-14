import * as express from 'express';
const router = express.Router();

import { indexFunc, catFunc, midiaFunc, loginviewFunc, signviewFunc } from '../controllers/rootControls.js';

router.route(['/', '/index{.html}'])
    .get(indexFunc);

router.route('/categoria{.html}')
    .get(catFunc);

router.route('/midia{.html}')
    .get(midiaFunc);

router.route('/signup{.html}')
    .get(signviewFunc)

router.route('/login{.html}')
    .get(loginviewFunc)

export default router;