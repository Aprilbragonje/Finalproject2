//opdr 7 Service laag voor interactie met Prisma client, data operatie create, read,update,delete

import prisma from "./prisma.js";

export async function getAllBookings() {
  return prisma.booking.findMany();
}

export async function getBookingById(id) {
  return prisma.booking.findUnique({
    where: { id },
  });
}

export async function createBooking(data) {
  return prisma.booking.create({
    data: {
      userId: data.userId,
      propertyId: data.propertyId,

      checkinDate: new Date(data.checkinDate),
      checkoutDate: new Date(data.checkoutDate),

      numberOfGuests: Number(data.numberOfGuests),
      totalPrice: Number(data.totalPrice),

      bookingStatus: data.bookingStatus || "confirmed",
    },
  });
}

export async function updateBooking(id, data) {
  return prisma.booking.update({
    where: { id },
    data: {
      ...data,

      bookingStatus: data.bookingStatus || "confirmed",
    },
  });
}

export async function deleteBooking(id) {
  return prisma.booking.delete({
    where: { id },
  });
}
