import { getCourses } from "@/app/actions/question-bank";

export type Course = {
  id: string;
  name: string;
};

export type Program = {
  id: string;
  name: string;
  courses: Course[];
};

export type UsersCourse = NonNullable<Awaited<ReturnType<typeof getCourses>>>[number];
