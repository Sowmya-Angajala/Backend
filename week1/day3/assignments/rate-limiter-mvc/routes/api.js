
import { Router } from "express";
import { publicHandler, limitedHandler } from "../controllers/apiController.js";
import limitedRateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.get("/public", publicHandler); // no limiter
router.get("/limited", limitedRateLimiter, limitedHandler); // with limiter

export default router;
