import express from 'express'
import { createListing, deleteListing, updateListing } from '../controllers/listingController.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create', verifyToken, createListing)
router.post('/update/:id', verifyToken, updateListing)
router.delete('/delete/:id', verifyToken, deleteListing)

export default router