import { Request, Response } from "express";
import { prisma } from "./../../prisma/client";
class ClassController {
  async getAll(req: Request, res: Response) {
    const classes = await prisma.class.findMany({ select: { name: true, students: true, id: true } });
    return res.json({ message: "Muvaffaqqiyatli amalga oshirildi!", classes });
  }
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const classById = await prisma.class.findMany({ where: { id } });
    return res.json({ message: "Muvaffaqqiyatli amalga oshirildi!", classById });
  }
  async createNew(req: Request, res: Response) {
    try {
      const newClass = await prisma.class.create({ data: req.body });
      return res.json({ message: "Muvaffaqqiyatli amalga oshirildi!", class: newClass });
    } catch (error) {
      return res.json({ message: "Xatolik! ", error });
    }
  }

  async editById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedClass = await prisma.class.update({ where: { id }, data: req.body });
      return res.json({ message: "Muvaffaqqiyatli amalga oshirildi!", class: updatedClass });
    } catch (error) {
      return res.json({ message: "Xatolik! ", error });
    }
  }
  async deleteById(req: Request, res: Response) {
    const { id } = req.params;
    const deletedClass = await prisma.class.delete({ where: { id } });
    return res.json({ message: "Muvaffaqqiyatli amalga oshirildi!", deletedClass });
  }
}

export const classController = new ClassController();
