//opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllProperties() {
  return prisma.property.findMany();
}

export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
  });
}

export async function createProperty(data) {
  return prisma.property.create({
    data,
  });
}

export async function updateProperty(id, data) {
  return prisma.property.update({
    where: { id },
    data,
  });
}

export async function deleteProperty(id) {
  return prisma.property.delete({
    where: { id },
  });
}
