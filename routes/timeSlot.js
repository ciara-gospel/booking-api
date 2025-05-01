import express from 'express';
import createTimeSlotHandler from '../controllers/timeSlotController.js';
import authMiddleware from '../middlewares/authmiddleware.js';
import { viewTimeSlotsHandler } from '../controllers/timeSlotController.js';
import { updateTimeSlotHandler } from '../controllers/timeSlotController.js';
import { deleteTimeSlotHandler } from '../controllers/timeSlotController.js';
import { viewAvailableSlotsHandler } from '../controllers/timeSlotController.js';
const router = express.Router();

// Route to create a time slot (only accessible by service providers)
router.post('/create', authMiddleware, createTimeSlotHandler);
router.get('/view', authMiddleware, viewTimeSlotsHandler);
router.put('/update', authMiddleware, updateTimeSlotHandler);
router.delete('/delete/:id', authMiddleware, deleteTimeSlotHandler);
router.get('/available', viewAvailableSlotsHandler);



export default router;