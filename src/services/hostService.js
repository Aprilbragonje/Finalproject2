//opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllHosts() {
  const hosts = await prisma.host.findMany();

  //password verwijderen uit response (feedback punt 2)
  return hosts.map(({ password, ...rest }) => rest);
}

export async function getHostById(id) {
  const host = await prisma.host.findUnique({
    where: { id },
  });

  if (!host) return null;

  // password verwijderen uit response (feedback punt 2)
  const { password, ...safeHost } = host;

  return safeHost;
}

export async function createHost(data) {
  //check of host al bestaat (op username!)
  const existingHost = await prisma.host.findFirst({
    where: {
      username: data.username,
    },
  });

  if (existingHost) {
    return {
      status: 409,
      message: "Host already exists",
    };
  }

  const host = await prisma.host.create({
    data,
  });

  const { password, ...safeHost } = host;

  return safeHost;
}
export async function updateHost(id, data) {
  const host = await prisma.host.update({
    where: { id },
    data,
  });

  //password niet teruggeven
  const { password, ...safeHost } = host;

  return safeHost;
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

  const host = await prisma.host.delete({
    where: { id },
  });

  // pass niet teruggeven
  const { password, ...safeHost } = host;

  return safeHost;
}
