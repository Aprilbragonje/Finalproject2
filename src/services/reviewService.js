////opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllReviews() {
  return prisma.review.findMany();
}

export async function getReviewById(id) {
  if (!id) return null;

  return prisma.review.findUnique({
    where: { id },
  });
}

export async function createReview(data) {
  const { propertyId, rating, userId } = data;

  //validatie toegevoegd om Prisma errors te voorkomen
  if (!propertyId || !rating || !userId) {
    return null;
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return null;
  }

  return prisma.review.create({
    data,
  });
}

export async function updateReview(id, data) {
  if (!id) return null;

  if (data.rating !== undefined) {
    const { rating } = data;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return null;
    }
  }

  return prisma.review.update({
    where: { id },
    data,
  });
}

export async function deleteReview(id) {
  if (!id) return null;

  return prisma.review.delete({
    where: { id },
  });
}
