"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Edit,
  Loader2,
  RefreshCw,
  Sparkles,
  ThumbsUp,
  Wand2,
  X,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function AIGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")

  const toggleQuestionExpand = (id: string) => {
    if (expandedQuestions.includes(id)) {
      setExpandedQuestions(expandedQuestions.filter((qId) => qId !== id))
    } else {
      setExpandedQuestions([...expandedQuestions, id])
    }
  }

  const handleGenerateQuestions = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      setGeneratedQuestions(sampleGeneratedQuestions)
      setIsGenerating(false)
      setHasGenerated(true)
    }, 2000)
  }

  const handleAddTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag])
      setCustomTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleQuickGenerate = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      setGeneratedQuestions(sampleGeneratedQuestions.slice(0, 3))
      setIsGenerating(false)
      setHasGenerated(true)
    }, 1500)
  }

  return (
    <DashboardShell>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Generate Questions with AI</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CircleHelp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>
                    Our AI generates high-quality questions based on your inputs. Provide a subject, topic, and other
                    parameters to get started.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" asChild>
              <Link href="/dashboard/question-bank">Back to Question Bank</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleGenerateQuestions()
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue="biology">
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Syllabus Outline</Label>
                  <Textarea
                    id="topic"
                    placeholder="Enter a specific topic or paste your syllabus outline here..."
                    className="min-h-[100px] resize-none"
                    defaultValue="Cellular respiration and photosynthesis, including the processes of glycolysis, Krebs cycle, and electron transport chain. Focus on energy production, ATP synthesis, and the relationship between these processes."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Multiple Choice", "True/False", "Short Answer", "Essay", "Fill-in-the-blank"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} defaultChecked={type === "Multiple Choice"} />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <RadioGroup defaultValue="medium" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="difficulty-easy" />
                      <Label htmlFor="difficulty-easy" className="cursor-pointer">
                        Easy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="difficulty-medium" />
                      <Label htmlFor="difficulty-medium" className="cursor-pointer">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="difficulty-hard" />
                      <Label htmlFor="difficulty-hard" className="cursor-pointer">
                        Hard
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Number of Questions</Label>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <Slider defaultValue={[5]} min={1} max={20} step={1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedTags.length === 0 && (
                      <span className="text-sm text-muted-foreground">No tags selected</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {["Respiration", "Photosynthesis", "Energy", "ATP", "Mitochondria", "Chloroplast"].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => {
                          if (!selectedTags.includes(tag)) {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Generations Panel */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
              {recentGenerations.length > 0 ? (
                <div className="space-y-4">
                  {recentGenerations.map((generation) => (
                    <div key={generation.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{generation.subject}</p>
                        <p className="text-sm text-muted-foreground">{generation.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent generations</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Generation Output Section */}
        <div className="lg:col-span-2">
          {!hasGenerated && !isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
              <div className="rounded-full bg-purple-100 p-6 mb-6">
                <Wand2 className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Generate questions instantly using AI</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Just tell us what you need. Fill out the form to the left and click "Generate with AI" to get started.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleQuickGenerate}>
                <Sparkles className="mr-2 h-4 w-4" />
                Start with a Sample Topic
              </Button>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Generating Questions</h3>
                  <p className="text-muted-foreground">Our AI is crafting high-quality questions for you...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Generated Questions</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Add All to Bank
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All ({generatedQuestions.length})</TabsTrigger>
                  <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
                  <TabsTrigger value="tf">True/False</TabsTrigger>
                  <TabsTrigger value="short">Short Answer</TabsTrigger>
                  <TabsTrigger value="essay">Essay</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4">
                  <div className="space-y-4">
                    {generatedQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        isExpanded={expandedQuestions.includes(question.id)}
                        onToggleExpand={() => toggleQuestionExpand(question.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="mcq" className="pt-4">
                  <div className="space-y-4">
                    {generatedQuestions
                      .filter((q) => q.type === "Multiple Choice")
                      .map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isExpanded={expandedQuestions.includes(question.id)}
                          onToggleExpand={() => toggleQuestionExpand(question.id)}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="tf" className="pt-4">
                  <div className="space-y-4">
                    {generatedQuestions
                      .filter((q) => q.type === "True/False")
                      .map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isExpanded={expandedQuestions.includes(question.id)}
                          onToggleExpand={() => toggleQuestionExpand(question.id)}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="short" className="pt-4">
                  <div className="space-y-4">
                    {generatedQuestions
                      .filter((q) => q.type === "Short Answer")
                      .map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isExpanded={expandedQuestions.includes(question.id)}
                          onToggleExpand={() => toggleQuestionExpand(question.id)}
                        />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="essay" className="pt-4">
                  <div className="space-y-4">
                    {generatedQuestions
                      .filter((q) => q.type === "Essay")
                      .map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isExpanded={expandedQuestions.includes(question.id)}
                          onToggleExpand={() => toggleQuestionExpand(question.id)}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 rounded-full h-14 w-14 p-0">
            <Wand2 className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Generate</DialogTitle>
            <DialogDescription>Generate questions with minimal inputs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quick-topic">Topic</Label>
              <Input id="quick-topic" placeholder="Enter a topic..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quick-type">Question Type</Label>
                <Select defaultValue="mcq">
                  <SelectTrigger id="quick-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="tf">True/False</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-difficulty">Difficulty</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="quick-difficulty">
                    <SelectValue />
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
              <Label htmlFor="quick-count">Number of Questions</Label>
              <Select defaultValue="3">
                <SelectTrigger id="quick-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Question</SelectItem>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleQuickGenerate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

// Question Card Component
interface QuestionCardProps {
  question: GeneratedQuestion
  isExpanded: boolean
  onToggleExpand: () => void
}

function QuestionCard({ question, isExpanded, onToggleExpand }: QuestionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
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
              <Badge variant="outline">{question.type}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{question.confidenceScore}%</span>
            </div>
          </div>

          <div className="mb-2">
            <p className="font-medium">{question.text}</p>
          </div>

          <button onClick={onToggleExpand} className="flex items-center text-sm text-purple-600 hover:text-purple-800">
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide Answer
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show Answer
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t">
              {question.type === "Multiple Choice" ? (
                <div className="space-y-2">
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 rounded-md ${
                        option.isCorrect ? "bg-green-50 border border-green-200" : ""
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          option.isCorrect
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option.text}</span>
                      {option.isCorrect && (
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Correct</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : question.type === "True/False" ? (
                <div className="font-medium">Answer: {question.answer}</div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p>{question.answer}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-1">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t bg-slate-50 px-4 py-2">
          <Button variant="ghost" size="sm">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <RefreshCw className="mr-1 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <ChevronRight className="mr-1 h-4 w-4" />
            Add to Bank
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Types
interface GeneratedQuestion {
  id: string
  text: string
  type: string
  difficulty: string
  confidenceScore: number
  tags: string[]
  options?: {
    text: string
    isCorrect: boolean
  }[]
  answer?: string
}

// Sample data
const sampleGeneratedQuestions: GeneratedQuestion[] = [
  {
    id: "q1",
    text: "Which of the following processes occurs in the mitochondria and is responsible for producing the majority of ATP during cellular respiration?",
    type: "Multiple Choice",
    difficulty: "Medium",
    confidenceScore: 98,
    tags: ["Cellular Respiration", "Mitochondria", "ATP"],
    options: [
      {
        text: "Glycolysis",
        isCorrect: false,
      },
      {
        text: "Krebs Cycle",
        isCorrect: false,
      },
      {
        text: "Electron Transport Chain",
        isCorrect: true,
      },
      {
        text: "Fermentation",
        isCorrect: false,
      },
    ],
  },
  {
    id: "q2",
    text: "True or False: Photosynthesis releases oxygen as a byproduct, while cellular respiration consumes oxygen.",
    type: "True/False",
    difficulty: "Easy",
    confidenceScore: 99,
    tags: ["Photosynthesis", "Cellular Respiration", "Oxygen"],
    answer: "True",
  },
  {
    id: "q3",
    text: "Explain the relationship between photosynthesis and cellular respiration in terms of energy flow and the products/reactants involved in each process.",
    type: "Essay",
    difficulty: "Hard",
    confidenceScore: 95,
    tags: ["Photosynthesis", "Cellular Respiration", "Energy Flow"],
    answer:
      "Photosynthesis and cellular respiration represent complementary processes in the flow of energy through ecosystems. Photosynthesis is an anabolic process that converts light energy into chemical energy stored in glucose, using carbon dioxide and water as reactants and producing oxygen as a byproduct. The overall equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.\n\nCellular respiration is a catabolic process that breaks down glucose to release energy in the form of ATP, using oxygen as a reactant and producing carbon dioxide and water as byproducts. The overall equation is: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP energy.\n\nThese processes form a cycle: the products of photosynthesis (glucose and oxygen) become the reactants for cellular respiration, while the products of cellular respiration (carbon dioxide and water) become the reactants for photosynthesis. This cyclical relationship maintains the balance of gases in the atmosphere and enables the flow of energy from the sun through producers to consumers in ecosystems.",
  },
  {
    id: "q4",
    text: "Describe the process of glycolysis and explain where it occurs in the cell.",
    type: "Short Answer",
    difficulty: "Medium",
    confidenceScore: 97,
    tags: ["Glycolysis", "Cellular Respiration", "Cytoplasm"],
    answer:
      "Glycolysis is the first stage of cellular respiration where one glucose molecule is split into two pyruvate molecules. It occurs in the cytoplasm of the cell and does not require oxygen. During glycolysis, two ATP molecules are consumed in the energy investment phase, but four ATP molecules are produced in the energy payoff phase, resulting in a net gain of two ATP molecules. Additionally, two NADH molecules are produced. Glycolysis is a universal process that occurs in nearly all living organisms.",
  },
  {
    id: "q5",
    text: "The light-dependent reactions of photosynthesis occur in the ________ of the chloroplast, while the Calvin cycle occurs in the ________.",
    type: "Fill-in-the-blank",
    difficulty: "Medium",
    confidenceScore: 96,
    tags: ["Photosynthesis", "Chloroplast", "Light Reactions", "Calvin Cycle"],
    answer: "thylakoid membrane; stroma",
  },
]

const recentGenerations = [
  {
    id: "gen1",
    subject: "Biology - Cellular Respiration",
    date: "Today at 10:30 AM",
  },
  {
    id: "gen2",
    subject: "Physics - Newton's Laws",
    date: "Yesterday at 2:45 PM",
  },
  {
    id: "gen3",
    subject: "Chemistry - Periodic Table",
    date: "May 15, 2025",
  },
]
