import { PrismaClient } from "@/lib/generated/prisma";
import sampleData from "./sample-data";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });
  console.log("Database seeded succefully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
