import { authMiddleware } from "@middlewares/auth.middleware";
import { roleMiddleware } from "@middlewares/role.middleware";
import { Router } from "express";
import { classController } from "../controllers/class.controller";

export const router = Router();

router.get("/class/all", authMiddleware, classController.getAll);
router.post("/class/new", authMiddleware, roleMiddleware("ADMIN"), classController.createNew);
router
  .route("/class/:id")
  .get(classController.getById)
  .post(authMiddleware, roleMiddleware("ADMIN"), classController.createNew)
  .put(authMiddleware, roleMiddleware("ADMIN"), classController.deleteById);
