// User login, account access

import express from 'express'
import {userRegister, userLogin, getProfile} from '../controllers/userControllers.js'

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin);
router.get('/getprofle', getProfile);

export default router;
