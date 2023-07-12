import { roleMiddleware } from "@/middlewares/role.middleware";
import { Controller } from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { Router } from "express";

export const router = Router();

router.get("/users", Controller.getUsers);
router.get("/student", authMiddleware, Controller.getStudentById);
router.get("/teacher", authMiddleware, Controller.getTeacherById);
router.get("/students", authMiddleware, Controller.getStudents);
router.get("/teachers", authMiddleware, Controller.getTeachers);
router.post("/auth/register", authMiddleware, roleMiddleware("ADMIN"), Controller.register);
router.post("/auth/login", Controller.login);
router.put("/user", authMiddleware, roleMiddleware("ADMIN"), Controller.editUser);
router.delete("/user", authMiddleware, roleMiddleware("ADMIN"), Controller.deleteUser);
