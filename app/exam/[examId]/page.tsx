"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamOption {
    id: string
    text: string
    isCorrect: boolean
}

interface ExamQuestion {
    id: string
    text: string
    type: string
    options: ExamOption[]
    position: number
    points: number
}

interface Exam {
    id: string
    title: string
    subject: string
    duration: number
    instructions: string
    questions: ExamQuestion[]
    allowReview: boolean
    showResults: boolean
}

interface StudentAnswer {
    questionId: string
    selectedOptionId: string | null
    isMarkedForReview: boolean
}

export default function OnlineExamPage({ params }: { params: Promise<{ examId: string }> }) {
    const [exam, setExam] = useState<Exam | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [examStarted, setExamStarted] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<StudentAnswer[]>([])
    const [timeRemaining, setTimeRemaining] = useState(0) // in seconds
    const [showSubmitDialog, setShowSubmitDialog] = useState(false)
    const [examSubmitted, setExamSubmitted] = useState(false)
    const [score, setScore] = useState<number | null>(null)
    const [showTimeWarning, setShowTimeWarning] = useState(false)

    useEffect(() => {
        const fetchExam = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const mockExam: Exam = {
                    id: "12",
                    title: "Biology Midterm Examination",
                    subject: "Biology",
                    duration: 60,
                    instructions:
                        "Answer all questions. Each question is worth the points indicated. You have 60 minutes to complete this examination. Choose the best answer for each multiple-choice question.",
                    allowReview: true,
                    showResults: true,
                    questions: [
                        {
                            id: "q1",
                            text: "Which of the following processes occurs in the mitochondria and is responsible for producing the majority of ATP during cellular respiration?",
                            type: "Multiple Choice",
                            position: 1,
                            points: 5,
                            options: [
                                { id: "opt1", text: "Glycolysis", isCorrect: false },
                                { id: "opt2", text: "Krebs Cycle", isCorrect: false },
                                { id: "opt3", text: "Electron Transport Chain", isCorrect: true },
                                { id: "opt4", text: "Fermentation", isCorrect: false },
                            ],
                        },
                        {
                            id: "q2",
                            text: "What is the primary function of chlorophyll in photosynthesis?",
                            type: "Multiple Choice",
                            position: 2,
                            points: 5,
                            options: [
                                { id: "opt5", text: "To absorb light energy", isCorrect: true },
                                { id: "opt6", text: "To produce glucose", isCorrect: false },
                                { id: "opt7", text: "To release oxygen", isCorrect: false },
                                { id: "opt8", text: "To store energy", isCorrect: false },
                            ],
                        },
                        {
                            id: "q3",
                            text: "Which of the following is NOT a characteristic of living organisms?",
                            type: "Multiple Choice",
                            position: 3,
                            points: 5,
                            options: [
                                { id: "opt9", text: "Growth and development", isCorrect: false },
                                { id: "opt10", text: "Response to stimuli", isCorrect: false },
                                { id: "opt11", text: "Ability to photosynthesize", isCorrect: true },
                                { id: "opt12", text: "Reproduction", isCorrect: false },
                            ],
                        },
                        {
                            id: "q4",
                            text: "What is the basic unit of heredity?",
                            type: "Multiple Choice",
                            position: 4,
                            points: 5,
                            options: [
                                { id: "opt13", text: "Chromosome", isCorrect: false },
                                { id: "opt14", text: "Gene", isCorrect: true },
                                { id: "opt15", text: "DNA", isCorrect: false },
                                { id: "opt16", text: "Protein", isCorrect: false },
                            ],
                        },
                        {
                            id: "q5",
                            text: "Which process converts glucose into pyruvate?",
                            type: "Multiple Choice",
                            position: 5,
                            points: 5,
                            options: [
                                { id: "opt17", text: "Glycolysis", isCorrect: true },
                                { id: "opt18", text: "Krebs Cycle", isCorrect: false },
                                { id: "opt19", text: "Electron Transport", isCorrect: false },
                                { id: "opt20", text: "Photosynthesis", isCorrect: false },
                            ],
                        },
                    ],
                }

                setExam(mockExam)
                setTimeRemaining(mockExam.duration * 60)
                setAnswers(
                    mockExam.questions.map((q) => ({
                        questionId: q.id,
                        selectedOptionId: null,
                        isMarkedForReview: false,
                    })),
                )
            } catch (err) {
                setError("Failed to load exam. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchExam()
    }, [])

    useEffect(() => {
        if (!examStarted || examSubmitted || timeRemaining <= 0) return

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                const newTime = prev - 1

                if (newTime === 300 && !showTimeWarning) {
                    setShowTimeWarning(true)
                }

                if (newTime <= 0) {
                    handleSubmitExam()
                    return 0
                }

                return newTime
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [examStarted, examSubmitted, timeRemaining, showTimeWarning])

    useEffect(() => {
        if (!examStarted || examSubmitted) return

        const autoSave = setInterval(() => {
            console.log("Auto-saving answers:", answers)
        }, 30000)

        return () => clearInterval(autoSave)
    }, [examStarted, examSubmitted, answers])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    const handleStartExam = () => {
        setExamStarted(true)
    }

    const handleAnswerChange = (questionId: string, optionId: string) => {
        setAnswers((prev) =>
            prev.map((answer) => (answer.questionId === questionId ? { ...answer, selectedOptionId: optionId } : answer)),
        )
    }

    const toggleMarkForReview = (questionId: string) => {
        setAnswers((prev) =>
            prev.map((answer) =>
                answer.questionId === questionId ? { ...answer, isMarkedForReview: !answer.isMarkedForReview } : answer,
            ),
        )
    }

    const handleNextQuestion = () => {
        if (exam && currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const handleSubmitExam = useCallback(() => {
        if (!exam) return

        let correctAnswers = 0
        exam.questions.forEach((question) => {
            const answer = answers.find((a) => a.questionId === question.id)
            if (answer?.selectedOptionId) {
                const selectedOption = question.options.find((opt) => opt.id === answer.selectedOptionId)
                if (selectedOption?.isCorrect) {
                    correctAnswers++
                }
            }
        })

        const calculatedScore = Math.round((correctAnswers / exam.questions.length) * 100)
        setScore(calculatedScore)
        setExamSubmitted(true)
        setShowSubmitDialog(false)
    }, [exam, answers])

    const getAnsweredCount = () => {
        return answers.filter((answer) => answer.selectedOptionId !== null).length
    }

    const getMarkedForReviewCount = () => {
        return answers.filter((answer) => answer.isMarkedForReview).length
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-muted-foreground">Loading your exam...</p>
                </div>
            </div>
        )
    }

    if (error || !exam) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold">Exam Not Found</h1>
                    <p className="text-muted-foreground">{error || "The exam you're looking for doesn't exist."}</p>
                    <Button onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    if (examSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardContent className="pt-6 text-center space-y-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Exam Submitted Successfully!</h1>
                            <p className="text-muted-foreground">Thank you for completing the {exam.title}.</p>
                        </div>

                        {exam.showResults && score !== null && (
                            <div className="bg-slate-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Your Results</h2>
                                <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
                                <p className="text-muted-foreground">
                                    You answered{" "}
                                    {
                                        answers.filter((a) => {
                                            const question = exam.questions.find((q) => q.id === a.questionId)
                                            const selectedOption = question?.options.find((opt) => opt.id === a.selectedOptionId)
                                            return selectedOption?.isCorrect
                                        }).length
                                    }{" "}
                                    out of {exam.questions.length} questions correctly.
                                </p>
                            </div>
                        )}

                        {exam.allowReview && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Review Your Answers</h3>
                                <div className="space-y-3 text-left">
                                    {exam.questions.map((question, index) => {
                                        const answer = answers.find((a) => a.questionId === question.id)
                                        const selectedOption = question.options.find((opt) => opt.id === answer?.selectedOptionId)
                                        const correctOption = question.options.find((opt) => opt.isCorrect)
                                        const isCorrect = selectedOption?.isCorrect || false

                                        return (
                                            <div key={question.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium">Question {index + 1}</h4>
                                                    <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                        {isCorrect ? "Correct" : "Incorrect"}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm mb-3">{question.text}</p>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <span className="font-medium">Your answer:</span>{" "}
                                                        {selectedOption?.text || "No answer selected"}
                                                    </p>
                                                    {!isCorrect && (
                                                        <p>
                                                            <span className="font-medium">Correct answer:</span> {correctOption?.text}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!examStarted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardContent className="pt-6 space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
                            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                                <span>{exam.subject}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {exam.duration} minutes
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h2 className="font-semibold mb-2">Instructions</h2>
                            <p className="text-sm">{exam.instructions}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{exam.questions.length}</div>
                                <div className="text-sm text-muted-foreground">Questions</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{exam.duration}</div>
                                <div className="text-sm text-muted-foreground">Minutes</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {exam.questions.reduce((sum, q) => sum + q.points, 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Points</div>
                            </div>
                        </div>

                        <Button onClick={handleStartExam} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                            Begin Exam
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const currentQuestion = exam.questions[currentQuestionIndex]
    const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)
    const progressPercentage = ((currentQuestionIndex + 1) / exam.questions.length) * 100

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-semibold">{exam.title}</h1>
                            <p className="text-sm text-muted-foreground">{exam.subject}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <span className="font-medium">{getAnsweredCount()}</span> of {exam.questions.length} answered
                                {getMarkedForReviewCount() > 0 && (
                                    <span className="ml-2 text-amber-600">({getMarkedForReviewCount()} marked for review)</span>
                                )}
                            </div>
                            <div
                                className={cn(
                                    "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                                    timeRemaining <= 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700",
                                )}
                            >
                                <Clock className="h-4 w-4" />
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>
                    <Progress value={progressPercentage} className="mt-2" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Question {currentQuestionIndex + 1} of {exam.questions.length}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{currentQuestion.points} points</Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleMarkForReview(currentQuestion.id)}
                                        className={cn(currentAnswer?.isMarkedForReview && "bg-amber-50 border-amber-300 text-amber-700")}
                                    >
                                        <Flag className="h-4 w-4 mr-1" />
                                        {currentAnswer?.isMarkedForReview ? "Marked" : "Mark for Review"}
                                    </Button>
                                </div>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg">{currentQuestion.text}</p>
                            </div>

                            <RadioGroup
                                value={currentAnswer?.selectedOptionId || ""}
                                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                                className="space-y-3"
                            >
                                {currentQuestion.options.map((option, index) => (
                                    <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50">
                                        <RadioGroupItem value={option.id} id={option.id} />
                                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                            {option.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentQuestionIndex === exam.questions.length - 1 ? (
                            <Button onClick={() => setShowSubmitDialog(true)} className="bg-green-600 hover:bg-green-700">
                                Submit Exam
                            </Button>
                        ) : (
                            <Button onClick={handleNextQuestion} className="flex items-center gap-2">
                                Next
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Time Warning Dialog */}
            <Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Time Warning
                        </DialogTitle>
                        <DialogDescription>
                            You have 5 minutes remaining to complete your exam. Please review your answers and submit when ready.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button onClick={() => setShowTimeWarning(false)}>Continue</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to submit your exam? You have answered {getAnsweredCount()} out of{" "}
                            {exam.questions.length} questions.
                            {getMarkedForReviewCount() > 0 && (
                                <span className="block mt-2 text-amber-600">
                                    You have {getMarkedForReviewCount()} questions marked for review.
                                </span>
                            )}
                            <span className="block mt-2 font-medium">This action cannot be undone.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmitExam} className="bg-green-600 hover:bg-green-700">
                            Submit Exam
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
