import express from 'express';
import { createAccount, deleteAccount, updateAccount } from '../controllers/accountControllers.js';


const router = express.Router();

router.post('/createAccount', createAccount);
router.delete('/deleteAccount', deleteAccount);
router.put('/upadateAccount', updateAccount);

export default router;