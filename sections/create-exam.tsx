"use client";

import type React from "react";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
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
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UsersCourse } from "@/types";
import { getQuestions } from "@/app/actions/question-bank";

interface Props {
  courses: UsersCourse[];
  questions: NonNullable<Awaited<ReturnType<typeof getQuestions>>>;
}

type ExamQuestion = Props["questions"][number] & {
  points: number;
};

export default function CreateExamPage({ courses, questions }: Props) {
  const [examDate, setExamDate] = useState<Date>();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [activeTab, setActiveTab] = useState("bank");

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
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Publish
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
                        defaultValue="Biology Midterm Examination"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select defaultValue="biology">
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
                            {examDate ? (
                              format(examDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={examDate}
                            onSelect={setExamDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Select defaultValue="9am">
                        <SelectTrigger>
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9am">9:00 AM</SelectItem>
                          <SelectItem value="10am">10:00 AM</SelectItem>
                          <SelectItem value="11am">11:00 AM</SelectItem>
                          <SelectItem value="12pm">12:00 PM</SelectItem>
                          <SelectItem value="1pm">1:00 PM</SelectItem>
                          <SelectItem value="2pm">2:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="duration"
                        type="number"
                        defaultValue="60"
                        className="w-24"
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
                      defaultValue="Answer all questions. Each question is worth the points indicated. You have 60 minutes to complete this examination."
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
                            className="p-3 hover:bg-slate-50 flex items-start"
                          >
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                toggleQuestionSelection(question.id)
                              }
                              className="mr-3 mt-1"
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
                                toggleQuestionSelection(question.id);
                                addSelectedQuestions();
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

            {/* Exam Builder Canvas */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Exam Builder</h3>
                  <div className="text-sm text-muted-foreground">
                    {examQuestions.length} questions | Total:{" "}
                    {examQuestions.reduce((sum, q) => sum + q.points, 0)} points
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
                              onClick={() => moveQuestion(question.id, "down")}
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
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTab("bank");
                        }}
                      >
                        Add from Bank
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          setActiveTab("ai");
                        }}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Exam Settings */}
        <div className="lg:col-span-1 min-w-0">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Exam Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shuffle-questions">
                          Shuffle Questions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Randomize the order of questions
                        </p>
                      </div>
                      <Switch id="shuffle-questions" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="one-per-page">
                          One Question Per Page
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display each question on a separate page
                        </p>
                      </div>
                      <Switch id="one-per-page" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="randomize-answers">
                          Randomize Answer Order
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Shuffle the order of multiple choice options
                        </p>
                      </div>
                      <Switch id="randomize-answers" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="privacy">Privacy</Label>
                      <Select defaultValue="private">
                        <SelectTrigger id="privacy">
                          <SelectValue placeholder="Select privacy setting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">
                            Private (Only you)
                          </SelectItem>
                          <SelectItem value="shared">
                            Shared (Specific users)
                          </SelectItem>
                          <SelectItem value="public">
                            Public (All users)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Marking Scheme</Label>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm text-muted-foreground">
                            Auto-generate marking scheme
                          </p>
                        </div>
                        <Switch id="auto-marking" defaultChecked />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Marking Scheme
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                  <h3 className="text-lg font-semibold mb-4">Exam Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Difficulty Distribution</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs">Easy: 30%</span>
                        <div className="w-2 h-2 rounded-full bg-amber-500 ml-2"></div>
                        <span className="text-xs">Medium: 50%</span>
                        <div className="w-2 h-2 rounded-full bg-red-500 ml-2"></div>
                        <span className="text-xs">Hard: 20%</span>
                      </div>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="bg-green-500 w-[30%]"></div>
                        <div className="bg-amber-500 w-[50%]"></div>
                        <div className="bg-red-500 w-[20%]"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Question Types</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">MCQ: 60%</Badge>
                        <Badge variant="outline">Short Answer: 20%</Badge>
                        <Badge variant="outline">Essay: 20%</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Completion Time</Label>
                      <div className="text-sm">
                        <span className="font-medium">55 minutes</span> (5
                        minutes under allocated time)
                      </div>
                    </div>
                  </div>
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
