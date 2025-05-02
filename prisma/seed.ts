import { PrismaClient } from "@prisma/client";
// @ts-expect-error the seeder requires .ts we should fix this in the future
import { seedPatients } from "./seed-patient.data.ts";

const prisma = new PrismaClient();

async function main() {
  //NOTE: This initiates multiple upserts in parallel, which is efficient for seeding, but be cautious with large datasets as it may lead to performance issues.
  await Promise.all(
    seedPatients.map((patient) =>
      prisma.patient.upsert({
        where: { id: patient.id },
        create: patient,
        update: {},
      }),
    ),
  );

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
