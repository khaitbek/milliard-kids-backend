import { roleMiddleware } from "@/middlewares/role.middleware";
import { Controller } from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { Router } from "express";

export const router = Router();

router.get("/users", Controller.getUsers);
router.get("/students", authMiddleware, Controller.getStudents);
router.get("/teachers", authMiddleware, Controller.getTeachers);
router.get("/students/:id", authMiddleware, Controller.getStudentById);
router.get("/teachers/:id", authMiddleware, Controller.getTeacherById);
router.post("/auth/register", authMiddleware, roleMiddleware("ADMIN"), Controller.register);
router.post("/auth/login", Controller.login);
router.put("/user", authMiddleware, roleMiddleware("ADMIN"), Controller.editUser);
router.delete("/user", authMiddleware, roleMiddleware("ADMIN"), Controller.deleteUser);
