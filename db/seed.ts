import { PrismaClient } from "@/lib/generated/prisma";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });
  const users = [];
  for (const user of sampleData.users) {
    users.push({ ...user, password: await hash(user.password) });
  }
  await prisma.user.createMany({
    data: users,
  });
  console.log("Database seeded succefully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
