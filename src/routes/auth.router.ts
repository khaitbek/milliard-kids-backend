import { Router } from "express";
import { Controller } from "../controllers/auth.controller";

export const router = Router();

router.get("/auth/users", Controller.getUsers);
router.post("/auth/register", Controller.register);
router.get("/auth/login", Controller.login);
