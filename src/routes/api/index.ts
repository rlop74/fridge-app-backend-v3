import { Router } from "express";

import v1Routes from "./v1";

const router = Router();

// http://localhost:<port>/api/v1/...
router.use("/v1", v1Routes);

export default router;
