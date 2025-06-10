"use server";

import { AcademicLevel } from "@/lib/generated/prisma";
import Prisma from "@/lib/prisma";
import { Program } from "@/types";

export async function getProfile(userId: string) {
  return Prisma.profile.findUnique({
    where: { userId },
    include: {
      programs: {
        include: {
          courses: true,
        },
      },
    },
  });
}

export async function updateProile({
  institution,
  programs,
  academicLevel,
  userId,
}: {
  institution: string;
  programs: Program[];
  academicLevel: AcademicLevel;
  userId?: string;
}) {
  await Prisma.profile.upsert({
    where: {
      userId,
    },
    update: {
      institution,
      academicLevel,
      programs: {
        create: programs.map((p) => ({
          name: p.name,
          courses: {
            create: p.courses.map((c) => ({ name: c.name })),
          },
        })),
      },
    },
    create: {
      //@ts-expect-error string may be undefined
      userId,
      institution,
      academicLevel,
      programs: {
        create: programs.map((p) => ({
          name: p.name,
          courses: {
            create: p.courses.map((c) => ({ name: c.name })),
          },
        })),
      },
    },
    include: {
      programs: {
        include: {
          courses: true,
        },
      },
    },
  });
}
