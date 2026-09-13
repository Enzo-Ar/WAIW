import * as express from 'express';
const router = express.Router();

import { indexFunc, catFunc, midiaFunc, loginviewFunc, loginpostFunc, signviewFunc, signpostFunc } from '../controllers/rootControls.js';

router.route(['/', '/index{.html}'])
    .get(indexFunc);

router.route('/categoria{.html}')
    .get(catFunc);

router.route('/midia{.html}')
    .get(midiaFunc);

router.route('/signup{.html}')
    .get(signviewFunc)
    .post(signpostFunc);

router.route('/login{.html}')
    .get(loginviewFunc)
    .post(loginpostFunc);

export default router;