import { Router } from "express";
import { checkHealth } from "../controllers/user-auth/health.controller";

const authRouter = Router();

authRouter.get("/check-health", checkHealth);

export default authRouter;