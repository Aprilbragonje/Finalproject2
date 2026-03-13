//opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllHosts() {
  return prisma.host.findMany();
}

export async function getHostById(id) {
  return prisma.host.findUnique({
    where: { id },
  });
}

export async function createHost(data) {
  return prisma.host.create({
    data,
  });
}

export async function updateHost(id, data) {
  return prisma.host.update({
    where: { id },
    data,
  });
}

export async function deleteHost(id) {
  const properties = await prisma.property.findMany({
    where: { hostId: id },
  });

  const propertyIds = properties.map((p) => p.id);

  await prisma.booking.deleteMany({
    where: { propertyId: { in: propertyIds } },
  });

  await prisma.review.deleteMany({
    where: { propertyId: { in: propertyIds } },
  });

  await prisma.property.deleteMany({
    where: { hostId: id },
  });

  return prisma.host.delete({
    where: { id },
  });
}
