import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API Request" });
});

router.post("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Success" });
});

export default router;
