// Employee login, manage accounts
import express from 'express';
import {employeeRegister, employeeLogin, getProfile} from '../controllers/employeeControllers.js'

const router = express.Router();

router.post('/register', employeeRegister);
router.post('/login', employeeLogin);
router.get('/getProfile', getProfile);

export default router;