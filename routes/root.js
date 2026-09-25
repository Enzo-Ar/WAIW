import * as express from 'express';
const router = express.Router();

import { indexFunc, catFunc, midiaFunc, loginviewFunc, signviewFunc, registroFunc, atualizarFunc } from '../controllers/rootControls.js';

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

router.route('/registro{.html}')
    .get(registroFunc);

router.route('/atualizar{.html}')
    .get(atualizarFunc);
    
export default router;