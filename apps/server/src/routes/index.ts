import { Router } from "express"
import authRouter from "./auth.route";

const mainrouter = Router();

mainrouter.use("/auth", authRouter);

export default mainrouter;