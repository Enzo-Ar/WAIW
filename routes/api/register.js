import * as express from 'express';
import { postRegisterUser } from '../../controllers/signupControls.js';
const router = express.Router();

router.route('/')
    .post(postRegisterUser);

export default router;