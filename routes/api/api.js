import * as express from 'express';
import { getData, getSingular, postRegisterUser, postLoginUser } from '../../controllers/apiControls.js';
const router = express.Router();

router.route('/:tipo')
    .get(getData);

router.route('/:tipo/:id')
    .get(getSingular);

router.route('/registerUser')
    .post(postRegisterUser);

router.route('/loginUser')
    .post(postLoginUser);

export default router;