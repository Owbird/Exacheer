"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues as QuestionFormValues } from "@/schema/dashboard/question-bank";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UsersCourse } from "@/types";
import { Sparkles } from "lucide-react";
import { runPrompt } from "@/app/actions/llm";
import { useState } from "react";
import { addQuestion } from "@/app/actions/question-bank";
import { useWatch } from "react-hook-form";

const formSchema = z.object({
  subject: z.string().min(1, "Select a subject"),
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.string().min(1, "Select difficulty level"),
  numOptions: z.string(),
  numQuestions: z.string(),
  instructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
};

interface Props {
  courses: UsersCourse[];
  difficultyLevels: string[];
}

export default function AIFab({ courses, difficultyLevels }: Props) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numOptions: "4",
      numQuestions: "5",
    },
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);

  const onSubmit = async (data: FormValues) => {
    const prompt = `
Generate ${data.numQuestions} multiple-choice questions for the subject "${
      data.subject
    }" on the topic "${data.topic}".
Each question should have ${
      data.numOptions
    } options, one correct answer, and be of "${data.difficulty}" difficulty.
${data.instructions ? `Instructions: ${data.instructions}` : ""}
Return the result as a JSON array with this shape:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", ...],
    "correctIndex": 0,
    "difficulty": "easy|medium|hard"
  }
]
`;

    try {
      const aiResponse = await runPrompt(prompt, {
        history: [],
        systemInstruction:
          "You are an expert question generator for educational content. Only return valid JSON as specified.",
      });

      let questions: GeneratedQuestion[] = [];

      let content =
        typeof aiResponse === "string"
          ? aiResponse
          : (aiResponse as any).toString?.() ?? "";

      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          questions = JSON.parse(content);
        }
      } catch (parseError) {
        alert(aiResponse);
      }

      setGeneratedQuestions(questions);
    } catch (err) {
      alert("Failed to generate questions. Please try again.");
      console.error(err);
    }
  };

  const selectedCourse = useWatch({
    control,
    name: "subject",
  });

  const handleAddQuestion = async (idx: number, q: GeneratedQuestion) => {
    const fullQuestion: QuestionFormValues = {
      correctIndex: q.correctIndex,
      question: q.question,
      options: q.options,
      course:
        courses.find(
          (course) =>
            course.name.toLowerCase() === selectedCourse.toLowerCase(),
        )?.id || "",
      difficulty: q.difficulty,
    };

    await addQuestion(fullQuestion);
    handleDiscardQuestion(idx);
  };

  const handleDiscardQuestion = (idx: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 rounded-full h-14 px-6">
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Questions
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-full sm:max-w-[500px] md:max-w-[600px] px-4 overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>AI Question Generator</SheetTitle>
          <SheetDescription>
            Generate high-quality questions with AI assistance
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(({ name }) => (
                      <SelectItem key={name} value={name.toLowerCase()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="Enter specific topic (e.g., Photosynthesis)"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-red-500 text-sm">{errors.topic.message}</p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.difficulty && (
              <p className="text-red-500 text-sm">
                {errors.difficulty.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label>Number of Options</Label>
            <Controller
              name="numOptions"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Options</SelectItem>
                    <SelectItem value="4">4 Options</SelectItem>
                    <SelectItem value="5">5 Options</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <Controller
              name="numQuestions"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Question</SelectItem>
                    <SelectItem value="3">3 Questions</SelectItem>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label>Additional Instructions (Optional)</Label>
            <Textarea
              placeholder="Any specific requirements or context for the questions"
              {...register("instructions")}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>

          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <Label className="text-lg">Generated Questions</Label>
              {generatedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-2 relative"
                >
                  <div className="font-medium">{q.question}</div>
                  <ul className="list-decimal list-inside ml-4">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          i === q.correctIndex
                            ? "font-semibold text-green-700"
                            : ""
                        }
                      >
                        {opt}
                        {i === q.correctIndex && (
                          <span className="ml-2 text-xs text-green-600">
                            (Correct)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAddQuestion(idx, q)}
                      type="button"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => handleDiscardQuestion(idx)}
                      type="button"
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
