import config from "../config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import { validationResult } from "express-validator";
import { type User } from "@prisma/client";
import { type Request, Response } from "express";

const generateAccessToken = (id: User["id"], role: User["role"]) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, config.secretKey, { expiresIn: "24h" });
};

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Xatolik yuz berdi!", errors });
      }
      const { username, password, email, profileImg } = req.body as User;
      const candidate = await prisma.user.findFirst({ where: { username, password } });
      if (candidate) return res.status(400).json({ message: "Bunday foydalanuvchi mavjud" });
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await prisma.user.create({
        data: { username, password: hashPassword, email, profileImg },
        select: { email: true, id: true, profileImg: true, role: true, username: true },
      });
      return res.json({ message: "Muvaffaqqiyatli ro'yxatdan o'tildi", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Registratiyada xatolik yuz berdi!", error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findFirst({ where: { username } });
      if (!user) {
        return res.status(400).json({ message: `Parol yoki username xato` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Parol yoki username xato` });
      }
      const token = generateAccessToken(user.id, user.role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Loginda xatolik yuz berdi!" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: { profileImg: true, username: true },
      });
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
      const body = req.body as User;
      const updatedUser = prisma.user.update({
        where: { id },
        data: body,
        select: { username: true, profileImg: true },
      });
      return res.json({ user: updatedUser, message: "Muvaffaqqiyatli yangilandi!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
      const deletedUser = await prisma.user.delete({ where: { id }, select: { username: true, profileImg: true } });
      return res.json({ message: "Muvaffaqqiyatli o'chirildi!", deletedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }
}

export const Controller = new AuthController();
