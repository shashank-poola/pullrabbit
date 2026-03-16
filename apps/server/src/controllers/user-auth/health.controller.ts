import type { Request, Response } from "express";

export const checkHealth = async (req: Request, res: Response) => {
    res.status(200).json({
        success: "failure",
        data: "HEALTH_OK",
        error: null
    })
    return
}