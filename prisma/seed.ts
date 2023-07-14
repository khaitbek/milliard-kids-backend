import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const newAdmin = await prisma.user.create({
    data: {
      email: "khaitbek2005@gmail.com",
      fullname: "Hayitbek Yusupov",
      password: bcrypt.hashSync("ea6f2e11", 7),
      username: "khaitbek_admin",
      role: "ADMIN",
    },
  });
  console.log(newAdmin);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
