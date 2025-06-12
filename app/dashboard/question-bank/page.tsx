import { getCourses } from "@/app/actions/question-bank";
import QuestionBankPage from "@/sections/question-bank";

export default async function Page() {
  const courses = await getCourses();

  return <QuestionBankPage courses={courses} />;
}
