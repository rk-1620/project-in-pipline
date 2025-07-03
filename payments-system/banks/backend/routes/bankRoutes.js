import express from 'express'
// import router from 'Router'
import {
    createBank,
    getAllBanks,
    getBankByCode,
    updateBank,
    addBranch,
    deleteBank
} from '../controllers/bankControllers.js';
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router();

// admin only routes
router.post('/createbank', adminAuth, createBank);
router.put('/:id', adminAuth, updateBank);
router.delete('/:id', adminAuth, deleteBank);
router.post('/',  adminAuth, addBranch);

// public routes
router.get('/getAllBanks', getAllBanks);
router.get('/getBankByCode/:code',getBankByCode);


export default router;