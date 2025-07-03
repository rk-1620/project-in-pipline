// Admin login, manage banks
import express from 'express';
import {adminRegister, adminLogin, getAdminProfile} from '../controllers/adminControllers.js';


const router = express.Router();

router.post('/adminregister', adminRegister);
router.post('/adminlogin', adminLogin);
router.get('/getadminprofile', getAdminProfile);

export default router;