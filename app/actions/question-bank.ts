"use server";

import Prisma from "@/lib/prisma";
import { FormValues } from "@/schema/dashboard/question-bank";
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

export async function addQuestion(data: FormValues) {
  const user = await currentUser();

  if (!user) return;

  const userId = user.id;

  await Prisma.question.create({
    data: {
      question: data.question,
      courseId: data.course,
      difficulty: data.difficulty,
      options: data.options,
      correctIndex: data.correctIndex,
      userId,
    },
  });
}
