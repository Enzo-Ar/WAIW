import * as express from 'express';
import handleLogout from '../../controllers/logoutControls.js';
const router = express.Router();

router.route('/')
    .post(handleLogout);

export default router;