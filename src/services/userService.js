//opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id) {
  await prisma.booking.deleteMany({
    where: { userId: id },
  });

  await prisma.review.deleteMany({
    where: { userId: id },
  });

  return prisma.user.delete({
    where: { id },
  });
}
