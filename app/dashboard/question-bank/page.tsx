"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Download,
  Edit,
  Eye,
  Filter,
  Grid,
  LayoutList,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function QuestionBankPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleQuestionSelection = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id))
    } else {
      setSelectedQuestions([...selectedQuestions, id])
    }
  }

  const clearSelection = () => {
    setSelectedQuestions([])
  }

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
                  <Input type="search" placeholder="Search topics, tags or questions..." className="w-[300px] pl-8" />
                </div>
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Narrow down questions by applying filters</SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-120px)] py-4">
                      <div className="space-y-6 pr-6">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subjects</SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">Chemistry</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="literature">Literature</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Topic</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="All Topics" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Topics</SelectItem>
                              <SelectItem value="cellular-respiration">Cellular Respiration</SelectItem>
                              <SelectItem value="photosynthesis">Photosynthesis</SelectItem>
                              <SelectItem value="genetics">Genetics</SelectItem>
                              <SelectItem value="evolution">Evolution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {["Easy", "Medium", "Hard"].map((difficulty) => (
                              <Badge key={difficulty} variant="outline" className="cursor-pointer hover:bg-slate-100">
                                {difficulty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {["MCQ", "Essay", "Short Answer", "Diagram", "Calculation"].map((tag) => (
                              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-slate-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="ai-generated" />
                          <label
                            htmlFor="ai-generated"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            AI-generated only
                          </label>
                        </div>

                        <div className="space-y-2">
                          <Label>Privacy</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="shared">Shared</SelectItem>
                              <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button variant="outline">Reset</Button>
                          <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                        </div>
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-l-md"
                  onClick={() => setViewMode("table")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-r-md"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" /> New Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                    <DialogDescription>Add a new question to your question bank</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question Text</Label>
                      <Textarea id="question" placeholder="Enter your question here..." className="min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select>
                          <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="Add tags separated by commas" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">Save Question</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search topics, tags or questions..." className="w-full pl-8" />
          </div>

          {/* Bulk Actions Bar */}
          {selectedQuestions.length > 0 && (
            <div className="flex items-center justify-between bg-white p-2 rounded-md border shadow-sm">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearSelection}>
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
          {viewMode === "table" ? (
            <div className="rounded-md border bg-white">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="h-12 w-12 px-4">
                        <Checkbox
                          checked={selectedQuestions.length === questions.length && questions.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedQuestions(questions.map((q) => q.id))
                            } else {
                              setSelectedQuestions([])
                            }
                          }}
                        />
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Question</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Subject / Topic</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 w-[100px] px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.id} className="border-b hover:bg-slate-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedQuestions.includes(question.id)}
                            onCheckedChange={() => toggleQuestionSelection(question.id)}
                          />
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-start gap-2">
                            {question.isAIGenerated && (
                              <Sparkles className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                            )}
                            <span className="line-clamp-2">{question.text}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{question.subject}</span>
                            <span className="text-xs text-muted-foreground">{question.topic}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            className={
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : question.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{question.status}</Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="text-xs">{question.date}</span>
                            <span className="text-xs text-muted-foreground">{question.time}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Add to Exam</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Share</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((question) => (
                <Card key={question.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <Checkbox
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={() => toggleQuestionSelection(question.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {question.isAIGenerated && <Sparkles className="h-4 w-4 text-amber-500" />}
                            <Badge
                              className={
                                question.difficulty === "Easy"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : question.difficulty === "Medium"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">{question.status}</Badge>
                          </div>
                          <p className="line-clamp-3 text-sm">{question.text}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {question.subject}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.topic}
                        </Badge>
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {question.date} at {question.time}
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
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>42</strong> questions
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <BookIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No questions here yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Your question bank is empty. Start by adding your first question or generate some with AI.
          </p>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Your First Question</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Question</DialogTitle>
                  <DialogDescription>Add a new question to your question bank</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question Text</Label>
                    <Textarea id="question" placeholder="Enter your question here..." className="min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select>
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" placeholder="Add tags separated by commas" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">Save Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Widget */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 rounded-full h-14 px-6">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Questions
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>AI Question Generator</SheetTitle>
            <SheetDescription>Generate high-quality questions with AI assistance</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Topic</Label>
              <Input placeholder="Enter specific topic (e.g., Photosynthesis)" />
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="mixed">Mixed Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question Type</Label>
              <Tabs defaultValue="mcq">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
                  <TabsTrigger value="short">Short Answer</TabsTrigger>
                  <TabsTrigger value="essay">Essay</TabsTrigger>
                </TabsList>
                <TabsContent value="mcq" className="pt-4">
                  <div className="space-y-2">
                    <Label>Number of Options</Label>
                    <Select defaultValue="4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Options</SelectItem>
                        <SelectItem value="4">4 Options</SelectItem>
                        <SelectItem value="5">5 Options</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="short" className="pt-4">
                  <div className="space-y-2">
                    <Label>Answer Length</Label>
                    <Select defaultValue="paragraph">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                        <SelectItem value="paragraph">Paragraph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="essay" className="pt-4">
                  <div className="space-y-2">
                    <Label>Essay Type</Label>
                    <Select defaultValue="analytical">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analytical">Analytical</SelectItem>
                        <SelectItem value="argumentative">Argumentative</SelectItem>
                        <SelectItem value="expository">Expository</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Select defaultValue="5">
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
            </div>

            <div className="space-y-2">
              <Label>Additional Instructions (Optional)</Label>
              <Textarea placeholder="Any specific requirements or context for the questions" />
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

// Sample data
const questions = [
  {
    id: "q1",
    text: "Explain the process of cellular respiration and how it relates to energy production in cells.",
    subject: "Biology",
    topic: "Cellular Respiration",
    difficulty: "Medium",
    status: "Published",
    date: "May 15, 2025",
    time: "10:30 AM",
    isAIGenerated: true,
    tags: ["Respiration", "Energy", "Mitochondria"],
  },
  {
    id: "q2",
    text: "Calculate the acceleration of an object with a mass of 5kg when a force of 20N is applied.",
    subject: "Physics",
    topic: "Newton's Laws",
    difficulty: "Easy",
    status: "Draft",
    date: "May 14, 2025",
    time: "2:45 PM",
    isAIGenerated: false,
    tags: ["Force", "Acceleration", "Calculation"],
  },
  {
    id: "q3",
    text: "Analyze the theme of power and corruption in Shakespeare's Macbeth, citing specific examples from the text.",
    subject: "Literature",
    topic: "Shakespeare",
    difficulty: "Hard",
    status: "Shared",
    date: "May 13, 2025",
    time: "11:20 AM",
    isAIGenerated: true,
    tags: ["Shakespeare", "Analysis", "Themes"],
  },
  {
    id: "q4",
    text: "Describe the structure of a DNA molecule and explain how DNA replication occurs.",
    subject: "Biology",
    topic: "Genetics",
    difficulty: "Medium",
    status: "Published",
    date: "May 12, 2025",
    time: "9:15 AM",
    isAIGenerated: false,
    tags: ["DNA", "Genetics", "Replication"],
  },
  {
    id: "q5",
    text: "Solve the following quadratic equation: 2x² + 5x - 3 = 0",
    subject: "Mathematics",
    topic: "Algebra",
    difficulty: "Easy",
    status: "Draft",
    date: "May 11, 2025",
    time: "3:30 PM",
    isAIGenerated: true,
    tags: ["Algebra", "Equations", "Quadratic"],
  },
]

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
  )
}
