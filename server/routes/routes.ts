import express from "express";
import {
  getLaunches,
  getUpcomingLaunches,
  getPreviousLaunches,
} from "../controller/controller";

const router = express.Router();

router.get("/launches", getLaunches);
router.get("/upcomingLaunches", getUpcomingLaunches);
router.get("/previousLaunches", getPreviousLaunches);

export default router;
