import config from "@/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type User } from "@prisma/client";
import { Response, type Request } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../../prisma/client";

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
      const body = req.body as User;
      const candidate = await prisma.user.findFirst({ where: body });
      if (candidate) return res.status(400).json({ message: "Bunday foydalanuvchi mavjud" });
      const hashPassword = bcrypt.hashSync(body.password, 7);
      const user = await prisma.user.create({
        data: {
          ...body,
          password: hashPassword,
        },
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
      const { email, password } = req.body as User;
      if (!email) return res.status(400).json({ message: "Bunday foydalanuvchi mavjud emas" });
      const user = await prisma.user.findFirst({ where: { email } });
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: `Parol yoki username xato` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Parol yoki username xato` });
      }
      const token = generateAccessToken(user.id, user.role);
      return res.json({
        token,
        user: {
          ...user,
          password: null,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Loginda xatolik yuz berdi!" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({});
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }
  async getStudents(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          fullname: true,
          username: true,
          id: true,
          class: true,
          // eslint-disable-next-line camelcase
          class_id: true,
          email: true,
          profileImg: true,
        },
        where: {
          role: "USER",
        },
      });
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }
  async getTeachers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          fullname: true,
          username: true,
          id: true,
          class: true,
          // eslint-disable-next-line camelcase
          class_id: true,
          email: true,
          profileImg: true,
        },
        where: {
          role: "TEACHER",
        },
      });
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }

  async getStudentsByClassId(req: Request, res: Response) {
    const id = req.query.id as string;
    // eslint-disable-next-line camelcase
    const students = await prisma.user.findMany({ where: { class_id: id } });
    return res.json({ students });
  }

  async getStudentById(req: Request, res: Response) {
    const id = req.query.id as string;
    const user = await prisma.user.findFirst({
      where: { id, role: "USER" },
      select: {
        class: true,
        // eslint-disable-next-line camelcase
        class_id: true,
        email: true,
        createdAt: true,
        scores: true,
        username: true,
        profileImg: true,
      },
    });
    if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
    return res.json({ user });
  }
  async getTeacherById(req: Request, res: Response) {
    const id = req.query.id as string;
    const user = await prisma.user.findFirst({ where: { id, role: "TEACHER" } });
    if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
    return res.json({ user });
  }

  async editUser(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
      const body = req.body as User;
      const updatedUser = await prisma.user.update({
        where: { id },
        data: body,
        // eslint-disable-next-line camelcase
        select: { username: true, profileImg: true, class: true, class_id: true },
      });
      console.log(updatedUser);
      return res.json({ user: updatedUser, message: "Muvaffaqqiyatli yangilandi!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) return res.status(400).json({ message: id + " ko'rinishidagi ID ga ega foydalanuvchi topilmadi!" });
      const deletedUser = await prisma.user.delete({ where: { id }, select: { username: true, profileImg: true } });
      return res.json({ message: "Muvaffaqqiyatli o'chirildi!", deletedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  }

  async searchUser(req: Request, res: Response) {
    try {
      const role = req.params?.role as User["role"];
      const query = req.query.query as User["fullname"];
      const users = await prisma.user.findMany({
        where: {
          fullname: {
            contains: query,
          },
          role: role.toUpperCase() as User["role"],
        },
        select: {
          username: true,
          class: true,
          // eslint-disable-next-line camelcase
          class_id: true,
          fullname: true,
          id: true,
          profileImg: true,
          email: true,
        },
      });
      if (!users) {
        return res.json({ message: "Hech narsat topilmadi!" });
      }
      return res.json({ users, query });
    } catch (error) {
      return res.json({ message: "Xatolik!", error });
    }
  }

  async markStudent(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      // eslint-disable-next-line camelcase
      const student = await prisma.user.findFirst({ where: { id } });
      if (!student) {
        return res.status(400).json({ message: "O'quvchi topilmadi!" });
      }
      console.log([{ ...req.body[0] }, { ...req.body[1] }, { ...req.body[2] }, { ...req.body[3] }]);
      const newScores = await prisma.score.createMany({
        data: [{ ...req.body[0] }, { ...req.body[1] }, { ...req.body[2] }, { ...req.body[3] }],
      });
      return res.status(200).json({ message: "Muvaffaqqiyatli yangilandi!", newScores });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Xatolik", error });
    }
  }
}

export const Controller = new AuthController();
