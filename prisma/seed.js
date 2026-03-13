// opdracht 6 seed datab
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

async function main() {
  console.log("Starting seed...");

  const usersData = readJSON("./src/data/users.json");
  const hostsData = readJSON("./src/data/hosts.json");
  const propertiesData = readJSON("./src/data/properties.json");
  const bookingsData = readJSON("./src/data/bookings.json");
  const reviewsData = readJSON("./src/data/reviews.json");

  await prisma.user.createMany({ data: usersData.users });
  console.log("Users seeded");

  await prisma.host.createMany({ data: hostsData.hosts });
  console.log("Hosts seeded");

  await prisma.property.createMany({ data: propertiesData.properties });
  console.log("Properties seeded");

  await prisma.booking.createMany({ data: bookingsData.bookings });
  console.log("Bookings seeded");

  await prisma.review.createMany({ data: reviewsData.reviews });
  console.log("Reviews seeded");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
