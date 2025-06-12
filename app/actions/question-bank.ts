"use server";

import Prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCourses() {
  const user = await currentUser();

  if (!user) return;

  const userId = user.id;

  return Prisma.course.findMany({
    where: { userId },
    include: { Program: { select: { name: true } } },
  });
}
