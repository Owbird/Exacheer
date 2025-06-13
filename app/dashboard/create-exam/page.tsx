import { getCourses, getQuestions } from "@/app/actions/question-bank";
import CreateExamPage from "@/sections/create-exam";

export default async function Page() {
  const [courses, questions] = await Promise.all([
    getCourses(),
    getQuestions(),
  ]);
  return <CreateExamPage courses={courses || []} questions={questions || []} />;
}
