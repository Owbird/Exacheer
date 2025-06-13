import { getCourses, getQuestions } from "@/app/actions/question-bank";
import QuestionBankPage from "@/sections/question-bank";

export default async function Page() {
  const [courses, questions] = await Promise.all([
    getCourses(),
    getQuestions(),
  ]);

  return <QuestionBankPage courses={courses || []} questions={questions || []} />;
}
