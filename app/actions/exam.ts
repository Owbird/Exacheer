"use server";

import Prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

type ExamPayload = {
  exam: {
    title: string;
    subject: string;
    date: Date;
    duration: number;
    instructions: string;
  };
  examQuestions: string[];
};

export async function saveExam(data: ExamPayload) {
  const user = await currentUser();

  if (!user) return;

  const userId = user.id;

  await Prisma.exam.create({
    data: {
      ...data.exam,
      userId,
      questions: {
        create: data.examQuestions.map((questionId, index) => ({
          question: {
            connect: { id: questionId },
          },
          position: index,
        })),
      },
    },
  });
}
