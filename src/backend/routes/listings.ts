import express from 'express';
import { createListing, getListings, getListingById, deleteListing } from '../controllers/listingController';
import { protect } from '../middleware/auth';
import { upload } from '../utils/cloudinary';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', protect, upload.array('images', 10), createListing);
router.delete('/:id', protect, deleteListing);

export { router as listingRouter };
