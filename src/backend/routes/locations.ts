import express from 'express';
import { governorates } from '../data/locations';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(governorates);
});

export { router as locationRouter };
