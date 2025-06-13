"use client";

import type React from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import AIFab from "@/components/dashboard/question-bank/ai-fab";
import { NewQuestionDialog } from "@/components/dashboard/question-bank/question-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { UsersCourse } from "@/types";
import {
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Share2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { getQuestions } from "@/app/actions/question-bank";

const difficultyLevels = ["Easy", "Medium", "Hard"];

interface Props {
  courses: UsersCourse[];
  questions: NonNullable<Awaited<ReturnType<typeof getQuestions>>>;
}

export default function QuestionBankPage({ courses, questions }: Props) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const toggleQuestionSelection = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
  };

  return (
    <DashboardShell>
      {/* Sticky Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Question Bank</h2>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search topics, tags or questions..."
                    className="w-[300px] pl-8"
                  />
                </div>
              </div>

              <NewQuestionDialog
                courses={courses}
                difficultyLevels={difficultyLevels}
              />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics, tags or questions..."
              className="w-full pl-8"
            />
          </div>

          {/* Bulk Actions Bar */}
          {selectedQuestions.length > 0 && (
            <div className="flex items-center justify-between bg-white p-2 rounded-md border shadow-sm">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={clearSelection}
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear selection ({selectedQuestions.length})
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="mr-1 h-4 w-4" />
                  Generate Variants
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {questions.length > 0 ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question) => (
              <Card
                key={question.id}
                style={{
                  border: "1.5px solid",
                  borderColor: question.aiGenerated ? "#1d4ed8" : "#e2e8f0",
                }}
                className={`overflow-hidden flex flex-col h-full border`}
              >
                <CardContent className="flex flex-col flex-1 p-0">
                  <div className="flex-1 flex flex-col justify-between p-4">
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <Checkbox
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={() =>
                            toggleQuestionSelection(question.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={
                                question.difficulty === "easy"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : question.difficulty === "medium"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {question.difficulty}
                            </Badge>
                            {question.aiGenerated && (
                              <Badge
                                className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                                variant="outline"
                              >
                                AI
                                <Sparkles className="ml-2 h-4 w-4" />
                              </Badge>
                            )}
                          </div>
                          <p className="line-clamp-3 text-sm">
                            {question.question}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {question.Course?.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-auto">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t bg-slate-50 px-4 py-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Add to Exam</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <BookIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No questions here yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Your question bank is empty. Start by adding your first question or
            generate some with AI.
          </p>
        </div>
      )}

      {/* Floating AI Assistant Widget */}
      <AIFab courses={courses} difficultyLevels={difficultyLevels} />
    </DashboardShell>
  );
}

// Empty state icon
function BookIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
