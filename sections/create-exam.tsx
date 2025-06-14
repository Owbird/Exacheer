"use client";

import { saveExam } from "@/app/actions/exam";
import { getQuestions } from "@/app/actions/question-bank";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UsersCourse } from "@/types";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  GripVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface Props {
  courses: UsersCourse[];
  questions: NonNullable<Awaited<ReturnType<typeof getQuestions>>>;
}

type ExamQuestion = Props["questions"][number] & {
  points: number;
};

type Exam = {
  title: string;
  subject: string;
  date: Date;
  duration: number;
  instructions: string;
};

type ExamField = keyof Exam;

export default function CreateExamPage({ courses, questions }: Props) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);

  const [exam, setExam] = useState({
    title: "Biology Midterm Examination",
    subject: "biology",
    date: new Date(),
    duration: 60,
    instructions:
      "Answer all questions. Each question is worth the points indicated. You have 60 minutes to complete this examination.",
  });

  const updateExam = <K extends ExamField>(field: K, value: Exam[K]) => {
    setExam((prev) => ({ ...prev, [field]: value }));
  };

  const toggleQuestionSelection = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const addSelectedQuestions = () => {
    const questionsToAdd = questions
      .filter((q) => selectedQuestions.includes(q.id))
      .map((q) => ({
        ...q,
        points: 10,
      }));
    setExamQuestions([...examQuestions, ...questionsToAdd]);
    setSelectedQuestions([]);
  };

  const removeQuestion = (id: string) => {
    setExamQuestions(examQuestions.filter((q) => q.id !== id));
  };

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const index = examQuestions.findIndex((q) => q.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === examQuestions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...examQuestions];
    const question = newQuestions[index];
    newQuestions.splice(index, 1);
    newQuestions.splice(
      direction === "up" ? index - 1 : index + 1,
      0,
      question,
    );
    setExamQuestions(newQuestions);
  };

  const updateQuestionPoints = (id: string, points: number) => {
    setExamQuestions(
      examQuestions.map((q) => (q.id === id ? { ...q, points } : q)),
    );
  };

  const handleSave = async () => {
    alert("Saving exam...");

    await saveExam({ exam, examQuestions: examQuestions.map((q) => q.id) });

    alert("Exam saved successfully!");
  };

  return (
    <DashboardShell>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Create New Exam
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <Badge variant="secondary" className="mr-2">
            Step 1: Exam Details
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
          <Badge variant="secondary" className="mr-2">
            Step 2: Add Questions
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
          <Badge variant="secondary">Step 3: Review & Publish</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr] gap-6 w-full">
        {/* Left Column: Exam Details & Add Questions */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          {/* Exam Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Details Form */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Exam Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-title">Exam Title</Label>
                      <Input
                        id="exam-title"
                        placeholder="Enter exam title"
                        value={exam.title}
                        onChange={(e) => updateExam("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={exam.subject}
                        onValueChange={(value) => updateExam("subject", value)}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exam-date">Exam Date & Time</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {exam.date ? (
                              format(exam.date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={exam.date}
                            onSelect={(date) => updateExam("date", date!)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        id="exam-time"
                        className="w-32"
                        value={exam.date ? format(exam.date, "HH:mm") : ""}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number);
                          const newDate = new Date(exam.date);
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);
                          updateExam("date", newDate);
                        }}
                        placeholder="Select time"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="duration"
                        type="number"
                        className="w-24"
                        value={exam.duration}
                        onChange={(e) =>
                          updateExam("duration", Number(e.target.value))
                        }
                      />
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">
                      Instructions / Exam Notes
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="Enter instructions for students..."
                      className="min-h-[100px]"
                      value={exam.instructions}
                      onChange={(e) =>
                        updateExam("instructions", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Questions Section */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Questions</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search questions..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="bg-slate-50 p-3 border-b flex items-center">
                      <Checkbox
                        checked={
                          selectedQuestions.length === questions.length &&
                          questions.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedQuestions(questions.map((q) => q.id));
                          } else {
                            setSelectedQuestions([]);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="font-medium">Select All</span>
                      <span className="ml-auto">
                        {selectedQuestions.length > 0 && (
                          <Button size="sm" onClick={addSelectedQuestions}>
                            <Plus className="mr-1 h-4 w-4" />
                            Add Selected ({selectedQuestions.length})
                          </Button>
                        )}
                      </span>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <div className="divide-y ">
                        {questions.map((question) => (
                          <div
                            key={question.id}
                            className="p-3  hover:bg-slate-50 flex items-start justify-center"
                          >
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                toggleQuestionSelection(question.id)
                              }
                              className="mr-4 mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium mb-1">
                                {question.question}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {question.Course?.name}
                                </Badge>
                                <Badge
                                  className={
                                    question.difficulty === "easy"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                                      : question.difficulty === "medium"
                                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs"
                                      : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.aiGenerated
                                    ? "AI Generated"
                                    : "Manual"}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!selectedQuestions.includes(question.id)) {
                                  setSelectedQuestions([
                                    ...selectedQuestions,
                                    question.id,
                                  ]);

                                  setExamQuestions([
                                    ...examQuestions,
                                    { ...question, points: 10 },
                                  ]);
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1 min-w-0">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Exam Builder Canvas */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Share Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-type">Access Type</Label>
                      <Select defaultValue="link">
                        <SelectTrigger id="access-type">
                          <SelectValue placeholder="Select access type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">
                            Anyone with the link
                          </SelectItem>
                          <SelectItem value="password">
                            Password protected
                          </SelectItem>
                          <SelectItem value="specific">
                            Specific users only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="share-with">
                        Share with Specific Users
                      </Label>
                      <Input
                        id="share-with"
                        placeholder="Enter email addresses..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple emails with commas
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      Apply Share Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Exam Builder</h3>
                    <div className="text-sm text-muted-foreground">
                      {examQuestions.length} questions | Total:{" "}
                      {examQuestions.reduce((sum, q) => sum + q.points, 0)}{" "}
                      points
                    </div>
                  </div>

                  {examQuestions.length > 0 ? (
                    <div className="space-y-3">
                      {examQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="border rounded-md bg-white hover:shadow-sm transition-shadow"
                        >
                          <div className="p-3 flex items-start gap-2">
                            <div className="flex items-center self-stretch pr-2 text-muted-foreground">
                              <GripVertical className="h-5 w-5 cursor-move" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium">
                                  {index + 1}. {question.question}
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                  <Label
                                    htmlFor={`points-${question.id}`}
                                    className="text-sm"
                                  >
                                    Points:
                                  </Label>
                                  <Input
                                    id={`points-${question.id}`}
                                    type="number"
                                    value={question.points}
                                    onChange={(e) =>
                                      updateQuestionPoints(
                                        question.id,
                                        Number.parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-16 h-8 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {question.Course?.name}
                                </Badge>
                                <Badge
                                  className={
                                    question.difficulty === "easy"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                                      : question.difficulty === "medium"
                                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs"
                                      : "bg-red-100 text-red-800 hover:bg-red-100 text-xs"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.aiGenerated
                                    ? "AI Generated"
                                    : "Manual"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveQuestion(question.id, "up")}
                                disabled={index === 0}
                                className="h-8 w-8"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  moveQuestion(question.id, "down")
                                }
                                disabled={index === examQuestions.length - 1}
                                className="h-8 w-8"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-slate-100 p-6 mb-4">
                        <ClipboardIcon className="h-12 w-12 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No questions yet
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Start building your exam by adding questions from your
                        question bank or generating new ones with AI.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

// Empty state icon
function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
